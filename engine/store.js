/* Local persistence. No account, no server, works offline.
 * One localStorage key holds the entire learner state. */

const KEY = "italiano.v1";
const DAY = 86400000;

const todayStamp = () => new Date().toISOString().slice(0, 10);

const blank = () => ({
  version: 1,
  created: Date.now(),
  cards: {},          // itemId -> { s, d, reps, lapses, due, last, stage, streak, fastCount }
  rules: {},          // ruleId -> { seen, wrong }
  day: { date: todayStamp(), seconds: 0, newCount: 0, reviewed: 0, correct: 0 },
  history: {}         // date -> { reviewed, correct, seconds }
});

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const parsed = JSON.parse(raw);
    return parsed && parsed.cards ? { ...blank(), ...parsed } : blank();
  } catch {
    return blank();
  }
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch { /* quota or private mode — stay usable, just don't persist */ }
}

export function get() {
  rollDay();
  return state;
}

/** Roll the daily counters over at local midnight, archiving the old day. */
function rollDay() {
  const t = todayStamp();
  if (state.day.date === t) return;
  if (state.day.reviewed > 0) {
    state.history[state.day.date] = {
      reviewed: state.day.reviewed,
      correct: state.day.correct,
      seconds: state.day.seconds
    };
  }
  state.day = { date: t, seconds: 0, newCount: 0, reviewed: 0, correct: 0 };
  save();
}

export function card(id) {
  return state.cards[id] || null;
}

export function isDue(id, now = Date.now()) {
  const c = state.cards[id];
  return !!c && c.due <= now;
}

export function isNew(id) {
  return !state.cards[id];
}

export function elapsedDays(id, now = Date.now()) {
  const c = state.cards[id];
  if (!c || !c.last) return 0;
  return Math.max(0, (now - c.last) / DAY);
}

export function putCard(id, data) {
  state.cards[id] = { ...(state.cards[id] || {}), ...data };
}

export function noteRules(ruleIds, wrong) {
  ruleIds.forEach(r => {
    const rec = state.rules[r] || (state.rules[r] = { seen: 0, wrong: 0 });
    rec.seen++;
    if (wrong) rec.wrong++;
  });
}

export function tickDay(seconds, correct) {
  state.day.seconds += seconds;
  state.day.reviewed++;
  if (correct) state.day.correct++;
}

export function countNewToday() {
  return state.day.newCount;
}

export function bumpNew() {
  state.day.newCount++;
}

export function reset() {
  state = blank();
  save();
}

export function exportJSON() {
  return JSON.stringify(state, null, 2);
}

export function importJSON(text) {
  const parsed = JSON.parse(text);
  if (!parsed || !parsed.cards) throw new Error("Not a valid progress file");
  state = { ...blank(), ...parsed };
  save();
}
