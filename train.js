/* Train mode UI — drives the engine. */

import { COURSE } from "./courses/it/course.js";
import * as store from "./engine/store.js";
import { createSession, progress, ruleStats, TOTAL_SECS, PHASES } from "./engine/session.js";

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Accent-, case- and punctuation-insensitive comparison.
 * Apostrophes are preserved as a class because they carry real grammar
 * (un amico vs un'amica), but curly and straight forms are unified. */
const norm = s => String(s)
  .toLowerCase()
  .replace(/[‘’ʼ]/g, "'")
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[.,!?;:…"]/g, "")
  .replace(/\s+/g, " ")
  .trim();

const root = $("#view-train");
let session = null, current = null, shownAt = 0, awaiting = false;
let tally = { n: 0, ok: 0 };

/* ---------- home ---------- */

function renderHome() {
  session = null;
  const p = progress(COURSE);
  const stats = ruleStats(COURSE).filter(r => r.seen > 0);
  const day = store.get().day;
  const tier = COURSE.tiers.find(t => t.n === p.tier) || COURSE.tiers[0];

  root.innerHTML = `
    <div class="intro">
      <h2>Train</h2>
      <p>Fifteen minutes, four phases, no decisions to make.</p>
    </div>

    <button class="start-btn" id="start">
      <span class="start-main">Start today's session</span>
      <span class="start-sub">${p.due} due · ${p.owned} of ${p.total} owned</span>
    </button>

    <div class="stat-row">
      <div class="stat"><b>${p.due}</b><i>due now</i></div>
      <div class="stat"><b>${p.seen}</b><i>introduced</i></div>
      <div class="stat"><b>${day.reviewed}</b><i>done today</i></div>
    </div>

    <h3 class="divider">Current tier</h3>
    <div class="card rule">
      <span class="card-title">Tier ${p.tier} — ${esc(tier.name)}</span>
      <p>${esc(tier.blurb)}</p>
    </div>

    <h3 class="divider">Rule mastery</h3>
    ${stats.length
      ? `<p class="note">Weakest first. The session attacks the top of this list.</p>
         <div class="heat">${stats.map(heatRow).join("")}</div>`
      : `<p class="note">Nothing measured yet — run a session and this fills in.</p>`}

    <h3 class="divider">Session shape</h3>
    <div class="shape">
      ${PHASES.map(ph => `<div class="shape-row"><b>${ph.secs / 60}m</b><span>${esc(ph.label)}</span><i>${esc(ph.blurb)}</i></div>`).join("")}
    </div>

    <div class="danger-row">
      <button class="ghost" id="export">Export progress</button>
      <button class="ghost" id="reset">Reset</button>
    </div>
  `;

  $("#start").onclick = start;
  $("#export").onclick = () => {
    const blob = new Blob([store.exportJSON()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `italiano-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  $("#reset").onclick = () => {
    if (confirm("Erase all progress? This cannot be undone.")) { store.reset(); renderHome(); }
  };
}

function heatRow(r) {
  const pct = r.accuracy == null ? 0 : Math.round(r.accuracy * 100);
  const cls = pct >= 85 ? "good" : pct >= 60 ? "mid" : "bad";
  return `<div class="heat-row">
      <span class="heat-label">${esc(r.label)}</span>
      <span class="heat-bar"><i class="${cls}" style="width:${pct}%"></i></span>
      <span class="heat-pct">${pct}%</span>
    </div>`;
}

/* ---------- drilling ---------- */

function start() {
  session = createSession(COURSE);
  tally = { n: 0, ok: 0 };
  renderDrill();
  nextQuestion();
}

function renderDrill() {
  root.innerHTML = `
    <div class="drill-top">
      <div class="phase-line">
        <span id="phase-name">Review</span>
        <span id="phase-count"></span>
      </div>
      <div class="timebar"><i id="timefill"></i></div>
    </div>

    <div class="quiz-card">
      <div class="prompt" id="d-cue"></div>
      <div class="prompt-sub" id="d-sub"></div>
      <form id="d-form" autocomplete="off">
        <input type="text" id="d-input" placeholder="in Italian" autocapitalize="none" autocorrect="off" spellcheck="false">
        <button type="submit" id="d-submit">Check</button>
      </form>
      <div class="feedback" id="d-feedback"></div>
      <div class="drill-actions">
        <button type="button" class="skip" id="d-skip">Don't know &rsaquo;</button>
        <button type="button" class="skip" id="d-quit">End session</button>
      </div>
    </div>
  `;
  $("#d-form").onsubmit = e => { e.preventDefault(); awaiting ? nextQuestion() : check(); };
  $("#d-skip").onclick = () => { if (!awaiting) grade(false, 20000); };
  $("#d-quit").onclick = renderSummary;
}

function nextQuestion() {
  if (session.done) return renderSummary();
  const picked = session.nextItem();
  if (!picked) return renderSummary();

  current = picked.item;
  awaiting = false;
  shownAt = performance.now();

  const phaseLabel = { relearn: "Second look", extra: "Extra reps" }[picked.phase] || session.phase.label;
  $("#phase-name").textContent = phaseLabel;
  $("#phase-count").textContent = `${tally.ok}/${tally.n}`;
  $("#timefill").style.width = `${Math.min(100, (session.elapsed / session.budget) * 100)}%`;

  $("#d-cue").innerHTML = esc(current.cue) +
    (current.note ? ` <small>${esc(current.note)}</small>` : "");
  $("#d-sub").textContent = current.sub;
  $("#d-feedback").className = "feedback";
  $("#d-feedback").textContent = "";

  const inp = $("#d-input");
  inp.value = "";
  inp.disabled = false;
  $("#d-submit").textContent = "Check";
  $("#d-skip").hidden = false;
  if (window.matchMedia("(min-width:700px)").matches) inp.focus();
}

function check() {
  const given = $("#d-input").value;
  if (!given.trim()) return;
  grade(matches(given, current), performance.now() - shownAt, given);
}

function matches(given, item) {
  const g = norm(given);
  return g === norm(item.a) || item.alt.some(x => norm(x) === g);
}

function grade(correct, latency, given = "") {
  const res = session.answer(current, correct, latency);
  tally.n++; if (correct) tally.ok++;

  const fb = $("#d-feedback");
  const when = res.interval === 1 ? "tomorrow" : `in ${res.interval} days`;
  if (correct) {
    const fast = latency <= 3500;
    fb.className = "feedback ok";
    fb.innerHTML = `${fast ? "Fast" : "Correct"} — <b>${esc(current.a)}</b>` +
      `<span>Back ${when}${res.stage === 2 ? " · automatic" : ""}</span>`;
  } else {
    fb.className = "feedback no";
    fb.innerHTML = `Not quite — <b>${esc(current.a)}</b>` +
      (given.trim() ? `<span>You wrote: ${esc(given.trim())}</span>` : `<span>Back ${when}</span>`);
  }

  $("#d-input").disabled = true;
  $("#d-submit").textContent = "Next";
  $("#d-skip").hidden = true;
  $("#phase-count").textContent = `${tally.ok}/${tally.n}`;
  $("#timefill").style.width = `${Math.min(100, (session.elapsed / session.budget) * 100)}%`;
  awaiting = true;

  if (session.done) setTimeout(() => { if (awaiting) renderSummary(); }, 1200);
}

/* ---------- summary ---------- */

function renderSummary() {
  const pct = tally.n ? Math.round((tally.ok / tally.n) * 100) : 0;
  const mins = Math.max(1, Math.round(session.elapsed / 60));
  const weak = ruleStats(COURSE).filter(r => r.seen >= 4 && r.accuracy != null && r.accuracy < 0.85)[0];

  root.innerHTML = `
    <div class="intro">
      <h2>Done</h2>
      <p>${tally.n} items · ${pct}% · about ${mins} min of focused work.</p>
    </div>

    <div class="stat-row">
      <div class="stat"><b>${tally.n}</b><i>answered</i></div>
      <div class="stat"><b>${pct}%</b><i>accuracy</i></div>
      <div class="stat"><b>${progress(COURSE).owned}</b><i>owned</i></div>
    </div>

    ${weak ? `<h3 class="divider">Next session will target</h3>
      <div class="card rule"><span class="card-title">${esc(weak.label)}</span>
      <p>${Math.round(weak.accuracy * 100)}% accurate across ${weak.seen} attempts. The engine will over-serve this until it's solid.</p></div>` : ""}

    <button class="start-btn secondary" id="more">
      <span class="start-main">Keep going</span>
      <span class="start-sub">Another 5 minutes</span>
    </button>
    <button class="ghost wide" id="home">Finish for today</button>
  `;

  $("#more").onclick = () => { session.extend(300); renderDrill(); nextQuestion(); };
  $("#home").onclick = renderHome;
}

renderHome();
export { renderHome };
