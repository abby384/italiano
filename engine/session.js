/* Session builder — the fixed daily shape.
 *
 * Borrowed from how language institutes structure contact hours:
 * review what's fading, attack your weakest rule, meter in a little new
 * material, then force free production. The learner makes no decisions.
 */

import * as store from "./store.js";
import { review, gradeFrom, retrievability, intervalFor } from "./scheduler.js";

const DAY = 86400000;

export const PHASES = [
  { key: "review",    label: "Review",      secs: 240, blurb: "What's fading" },
  { key: "remediate", label: "Weak spot",   secs: 240, blurb: "Your worst rule" },
  { key: "new",       label: "New",         secs: 180, blurb: "Fresh material" },
  { key: "produce",   label: "Production",  secs: 240, blurb: "Build it yourself" }
];

export const TOTAL_SECS = PHASES.reduce((n, p) => n + p.secs, 0);
const NEW_PER_DAY = 8;
const BOOTSTRAP_NEW = 15;   // first runs need enough material to be worth opening
const TIER_UNLOCK_RATIO = 0.7;
const SPEED_MS = 3500;

const owned = c => !!c && c.reps >= 2 && c.s >= 2;

/** Highest tier the learner has earned access to. */
export function unlockedTier(course) {
  const tiers = [...new Set(course.items.map(i => i.tier))].sort((a, b) => a - b);
  let top = tiers[0] ?? 0;
  for (let n = 0; n < tiers.length - 1; n++) {
    const t = tiers[n];
    const pool = course.items.filter(i => i.tier === t);
    const got = pool.filter(i => owned(store.card(i.id))).length;
    if (pool.length && got / pool.length >= TIER_UNLOCK_RATIO) top = tiers[n + 1];
    else break;
  }
  return top;
}

/** The rule you're currently worst at, with enough evidence to be believable. */
export function weakestRule(minSeen = 4) {
  const rules = store.get().rules;
  let worst = null, worstRate = 0;
  Object.entries(rules).forEach(([id, r]) => {
    if (r.seen < minSeen) return;
    const rate = r.wrong / r.seen;
    if (rate > worstRate && rate > 0.15) { worstRate = rate; worst = id; }
  });
  return worst ? { rule: worst, rate: worstRate } : null;
}

export function ruleStats(course) {
  const rules = store.get().rules;
  return Object.entries(course.rules).map(([id, label]) => {
    const r = rules[id] || { seen: 0, wrong: 0 };
    return {
      id, label,
      seen: r.seen,
      wrong: r.wrong,
      accuracy: r.seen ? (r.seen - r.wrong) / r.seen : null
    };
  }).sort((a, b) => (a.accuracy ?? 2) - (b.accuracy ?? 2));
}

export function progress(course) {
  const total = course.items.length;
  let seen = 0, ownedN = 0, due = 0;
  const now = Date.now();
  course.items.forEach(i => {
    const c = store.card(i.id);
    if (c) { seen++; if (owned(c)) ownedN++; if (c.due <= now) due++; }
  });
  return { total, seen, owned: ownedN, due, tier: unlockedTier(course) };
}

export function createSession(course) {
  const now = Date.now();
  const byId = new Map(course.items.map(i => [i.id, i]));
  const tierCap = unlockedTier(course);
  const weak = weakestRule();

  const dueQueue = course.items
    .filter(i => { const c = store.card(i.id); return c && c.due <= now; })
    .sort((a, b) => store.card(a.id).due - store.card(b.id).due);

  const remediateQueue = weak
    ? course.items
        .filter(i => i.rules.includes(weak.rule) && store.card(i.id))
        .sort((a, b) => {
          const ca = store.card(a.id), cb = store.card(b.id);
          return retrievability(store.elapsedDays(a.id), ca.s) -
                 retrievability(store.elapsedDays(b.id), cb.s);
        })
    : [];

  const newQueue = course.items
    .filter(i => i.tier <= tierCap && store.isNew(i.id))
    .sort((a, b) => a.tier - b.tier || a.order - b.order);

  const produceQueue = course.items
    .filter(i => (i.type === "prod" || i.type === "chunk") && store.card(i.id))
    .sort(() => Math.random() - 0.5);

  // Items introduced or missed this session come back before the session ends.
  const relearn = [];
  let budget = TOTAL_SECS;
  let elapsed = 0;
  let served = 0;
  const servedIds = new Set();

  function phaseAt(sec) {
    let acc = 0;
    for (const p of PHASES) {
      acc += p.secs;
      if (sec < acc) return p;
    }
    return PHASES[PHASES.length - 1];
  }

  const seenTotal = course.items.filter(i => store.card(i.id)).length;
  const newCap = seenTotal < BOOTSTRAP_NEW ? BOOTSTRAP_NEW : NEW_PER_DAY;

  /** The daily cap has to hold in every phase, not just the "new" block —
   *  otherwise an empty day-one queue quietly introduces the whole tier and
   *  buries you in reviews a week later. */
  const newAllowed = () => store.countNewToday() < newCap;

  function pull(queue) {
    while (queue.length) {
      const item = queue.shift();
      if (servedIds.has(item.id)) continue;
      if (store.isNew(item.id) && !newAllowed()) continue;
      return item;
    }
    return null;
  }

  function nextItem() {
    if (elapsed >= budget) return null;

    // anything due for a second look inside this session wins
    const ready = relearn.find(r => served >= r.after);
    if (ready) {
      relearn.splice(relearn.indexOf(ready), 1);
      return { item: ready.item, phase: "relearn" };
    }

    const phase = phaseAt(elapsed).key;
    const order = {
      review:    [dueQueue, remediateQueue, produceQueue, newQueue],
      remediate: [remediateQueue, dueQueue, produceQueue, newQueue],
      new:       [newQueue, dueQueue, remediateQueue, produceQueue],
      produce:   [produceQueue, dueQueue, remediateQueue, newQueue]
    }[phase];

    for (const q of order) {
      const item = pull(q);
      if (item) return { item, phase };
    }
    // everything exhausted — recycle seen material rather than stopping dead
    const seen = course.items.filter(i => store.card(i.id));
    if (!seen.length) return null;
    return { item: seen[Math.floor(Math.random() * seen.length)], phase: "extra" };
  }

  function answer(item, correct, latencyMs) {
    const secs = Math.min(30, latencyMs / 1000);
    elapsed += secs;
    served++;
    servedIds.add(item.id);

    const wasNew = store.isNew(item.id);
    if (wasNew) store.bumpNew();

    const prev = store.card(item.id);
    const grade = gradeFrom(correct, latencyMs);
    const next = review(prev, grade, store.elapsedDays(item.id));

    // stage ladder: recognise -> produce -> produce fast
    let stage = prev?.stage ?? 0;
    let streak = prev?.streak ?? 0;
    if (correct) {
      streak++;
      const fastEnough = stage < 1 || latencyMs <= SPEED_MS;
      if (streak >= 2 && stage < 2 && fastEnough) { stage++; streak = 0; }
    } else {
      stage = Math.max(0, stage - 1);
      streak = 0;
    }

    // a miss comes back later in this same session
    if (!correct || wasNew) relearn.push({ item, after: served + (correct ? 6 : 3) });

    store.putCard(item.id, {
      s: next.s, d: next.d, reps: next.reps, lapses: next.lapses,
      last: Date.now(),
      due: Date.now() + next.interval * DAY,
      stage, streak
    });
    store.noteRules(item.rules, !correct);
    store.tickDay(secs, correct);
    store.save();

    return { grade, interval: next.interval, stage };
  }

  return {
    nextItem,
    answer,
    extend(secs = 300) { budget += secs; },
    get elapsed() { return elapsed; },
    get budget() { return budget; },
    get phase() { return phaseAt(Math.min(elapsed, TOTAL_SECS - 1)); },
    get weakRule() { return weak; },
    get tierCap() { return tierCap; },
    get done() { return elapsed >= budget; }
  };
}
