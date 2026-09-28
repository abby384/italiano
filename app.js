/* Italian cheat sheet — rendering + drill engine */

const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ============ TABS ============ */

const REF_VIEWS = ["verbs", "irregular", "gender", "articles", "words", "quiz"];

function setMode(mode) {
  const train = mode === "train";
  document.querySelectorAll("#mode button").forEach(b =>
    b.classList.toggle("on", b.dataset.mode === mode));
  $("#view-train").hidden = !train;
  $("#tabs").hidden = train;
  document.body.classList.toggle("no-tabs", train);
  if (!train) {
    const active = $("#tabs button.active") || $("#tabs button");
    REF_VIEWS.forEach(v => {
      $("#view-" + v).hidden = "view-" + v !== "view-" + active.dataset.view;
    });
  } else {
    REF_VIEWS.forEach(v => { $("#view-" + v).hidden = true; });
  }
  window.scrollTo(0, 0);
}

$("#mode").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (b) setMode(b.dataset.mode);
});

const tabs = $("#tabs");
tabs.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  [...tabs.children].forEach(b => b.classList.toggle("active", b === btn));
  document.querySelectorAll(".view").forEach(v => {
    v.hidden = v.id !== "view-" + btn.dataset.view;
  });
  window.scrollTo(0, 0);
});

/* collapse / expand, delegated */
document.addEventListener("click", e => {
  const h = e.target.closest(".card-head, .word-head");
  if (!h) return;
  h.parentElement.classList.toggle("open");
});

/* ============ VERBS ============ */

function conjTable(label, forms) {
  const t = el("div", "tense");
  t.appendChild(el("div", "tense-name", esc(label)));
  const g = el("div", "conj");
  PRONOUNS.forEach((p, i) => {
    g.appendChild(el("span", null, esc(p)));
    g.appendChild(el("span", null, esc(forms[i])));
  });
  t.appendChild(g);
  return t;
}

function verbCard(v) {
  const card = el("div", "card");
  const head = el("div", "card-head");
  head.innerHTML =
    `<span class="card-title">${esc(v.inf)}</span>` +
    `<span class="card-en">${esc(v.en)}</span>` +
    `<span class="tag">${esc(v.type)}</span>` +
    `<span class="chev">&rsaquo;</span>`;
  card.appendChild(head);

  const body = el("div", "card-body");
  if (v.note) body.appendChild(el("p", "card-note", esc(v.note)));
  Object.entries(v.tenses).forEach(([name, forms]) => body.appendChild(conjTable(name, forms)));
  card.appendChild(body);
  return card;
}

function irregCard(v) {
  const card = el("div", "card");
  const head = el("div", "card-head");
  head.innerHTML =
    `<span class="card-title">${esc(v.inf)}</span>` +
    `<span class="card-en">${esc(v.en)}</span>` +
    `<span class="tag aux">${esc(v.aux)}</span>` +
    `<span class="chev">&rsaquo;</span>`;
  card.appendChild(head);

  const body = el("div", "card-body");
  if (v.note) body.appendChild(el("p", "card-note", esc(v.note)));
  body.appendChild(conjTable("Presente", v.forms));
  body.appendChild(conjTable("Imperfetto", v.imperfetto));
  const extra = el("div", "tense");
  extra.appendChild(el("div", "tense-name", "Key forms"));
  const g = el("div", "conj");
  g.appendChild(el("span", null, "participio"));
  g.appendChild(el("span", null, esc(v.pp)));
  g.appendChild(el("span", null, "futuro (io)"));
  g.appendChild(el("span", null, esc(v.futuro)));
  g.appendChild(el("span", null, "ausiliare"));
  g.appendChild(el("span", null, esc(v.aux)));
  extra.appendChild(g);
  body.appendChild(extra);

  card.appendChild(body);
  return card;
}

function ruleCard(r) {
  return el("div", "card rule",
    `<span class="card-title">${esc(r.t)}</span><p>${esc(r.d)}</p>`);
}

function pairTile(a, b, c) {
  return el("div", "pp",
    `${esc(a)}<b>${esc(b)}</b>${c ? `<i>${esc(c)}</i>` : ""}`);
}

REGULAR.forEach(v => $("#regular-verbs").appendChild(verbCard(v)));
VERB_RULES.forEach(r => $("#verb-rules").appendChild(ruleCard(r)));
PAST_RULES.forEach(r => $("#past-rules").appendChild(ruleCard(r)));
IRREGULAR.forEach(v => $("#irregular-verbs").appendChild(irregCard(v)));
IRREG_PP.forEach(([a, b]) => $("#irreg-pp").appendChild(pairTile(a, b)));

/* ============ GENDER ============ */

GENDER_RULES.forEach(r => $("#gender-rules").appendChild(ruleCard(r)));
ODD_PLURALS.forEach(([a, b, c]) => $("#odd-plurals").appendChild(pairTile(a, b, c)));

/* ============ ARTICLES ============ */

DEF_ARTICLES.forEach(a => {
  $("#def-articles").appendChild(el("div", "art",
    `<div class="art-key">${esc(a.art)}<small>pl. ${esc(a.plural)}</small></div>` +
    `<div><div class="art-when">${esc(a.when)}</div><div class="art-ex">${esc(a.ex)}</div></div>`));
});

INDEF_ARTICLES.forEach(a => {
  $("#indef-articles").appendChild(el("div", "art",
    `<div class="art-key">${esc(a.art)}</div>` +
    `<div><div class="art-when">${esc(a.when)}</div><div class="art-ex">${esc(a.ex)}</div></div>`));
});

ARTICLE_RULES.forEach(r => $("#article-rules").appendChild(ruleCard(r)));

(function prepTable() {
  const t = $("#prep-table");
  const thead = el("thead");
  const hr = el("tr");
  PREP_ARTICLES.headers.forEach(h => hr.appendChild(el("th", null, esc(h))));
  thead.appendChild(hr);
  t.appendChild(thead);
  const tb = el("tbody");
  PREP_ARTICLES.rows.forEach(row => {
    const tr = el("tr");
    row.forEach(c => tr.appendChild(el("td", null, esc(c))));
    tb.appendChild(tr);
  });
  t.appendChild(tb);
})();

/* ============ WORDS ============ */

WORD_GROUPS.forEach(g => {
  const wrap = $("#word-groups");
  wrap.appendChild(el("div", "wgroup-title", esc(g.group)));
  wrap.appendChild(el("p", "wgroup-sub", esc(g.sub)));
  g.items.forEach(([it, en, note]) => {
    const w = el("div", "word");
    w.innerHTML =
      `<div class="word-head"><span class="word-it">${esc(it)}</span><span class="word-en">${esc(en)}</span></div>` +
      `<div class="word-body">${esc(note)}</div>`;
    wrap.appendChild(w);
  });
});

/* ============ DRILL ============ */

const norm = s => String(s)
  .toLowerCase().trim()
  .replace(/[‘’ʼ]/g, "'")
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/\s+/g, " ");

function buildPools() {
  const reg = [], irr = [], art = [], plu = [];

  REGULAR.forEach(v => {
    Object.entries(v.tenses).forEach(([tense, forms]) => {
      forms.forEach((f, i) => reg.push({
        q: v.inf, sub: `${tense} · ${PRONOUNS[i]}`, a: f, hint: v.en
      }));
    });
  });

  IRREGULAR.forEach(v => {
    v.forms.forEach((f, i) => irr.push({
      q: v.inf, sub: `Presente · ${PRONOUNS[i]}`, a: f, hint: v.en
    }));
    v.imperfetto.forEach((f, i) => irr.push({
      q: v.inf, sub: `Imperfetto · ${PRONOUNS[i]}`, a: f, hint: v.en
    }));
    irr.push({ q: v.inf, sub: "Participio passato", a: v.pp, hint: v.en });
  });

  IRREG_PP.forEach(([inf, pp]) => irr.push({
    q: inf, sub: "Participio passato", a: pp, hint: ""
  }));

  QUIZ_ARTICLES.forEach(([noun, a]) => art.push({
    q: `___ ${noun}`, sub: "Definite article, singular", a, hint: ""
  }));

  QUIZ_PLURALS.forEach(([s, p]) => plu.push({
    q: s, sub: "Make it plural (article + noun)", a: p, hint: ""
  }));

  return { reg, irr, art, plu, all: [...reg, ...irr, ...art, ...plu] };
}

const POOLS = buildPools();

const MODES = [
  { key: "reg", label: "Regular" },
  { key: "irr", label: "Irregular" },
  { key: "art", label: "Articles" },
  { key: "plu", label: "Plurals" },
  { key: "all", label: "Mixed" }
];

let pool = null, current = null, right = 0, total = 0, streak = 0, best = 0, awaiting = false;

const modeRow = $("#quiz-modes");
MODES.forEach(m => {
  const b = el("button", null, m.label);
  b.dataset.key = m.key;
  modeRow.appendChild(b);
});

modeRow.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  [...modeRow.children].forEach(x => x.classList.toggle("on", x === b));
  pool = POOLS[b.dataset.key];
  right = total = streak = best = 0;
  $("#q-input").disabled = false;
  $("#q-submit").disabled = false;
  $("#q-skip").hidden = false;
  next();
});

function next() {
  awaiting = false;
  current = pool[Math.floor(Math.random() * pool.length)];
  $("#q-prompt").innerHTML = esc(current.q) +
    (current.hint ? ` <small>${esc(current.hint)}</small>` : "");
  $("#q-sub").textContent = current.sub;
  $("#q-feedback").className = "feedback";
  $("#q-feedback").textContent = "";
  const inp = $("#q-input");
  inp.value = "";
  inp.disabled = false;
  $("#q-submit").textContent = "Check";
  updateScore();
  if (window.matchMedia("(min-width: 700px)").matches) inp.focus();
}

function updateScore() {
  $("#score").textContent = `${right} / ${total}`;
  $("#streak").textContent = streak >= 3 ? `${streak} in a row` : (best >= 3 ? `best ${best}` : "");
}

function check() {
  const inp = $("#q-input");
  const given = inp.value;
  if (!given.trim()) return;
  total++;
  const ok = norm(given) === norm(current.a);
  const exact = given.trim() === current.a;
  const fb = $("#q-feedback");

  if (ok) {
    right++; streak++; best = Math.max(best, streak);
    fb.className = "feedback ok";
    fb.innerHTML = exact
      ? `Correct — <b>${esc(current.a)}</b>`
      : `Correct — <b>${esc(current.a)}</b><span>Watch the accents and apostrophes.</span>`;
  } else {
    streak = 0;
    fb.className = "feedback no";
    fb.innerHTML = `Not quite — <b>${esc(current.a)}</b><span>You wrote: ${esc(given.trim())}</span>`;
  }

  inp.disabled = true;
  awaiting = true;
  $("#q-submit").textContent = "Next";
  updateScore();
}

$("#q-form").addEventListener("submit", e => {
  e.preventDefault();
  if (awaiting) next(); else check();
});

$("#q-skip").addEventListener("click", () => {
  if (!awaiting) {
    streak = 0;
    $("#q-feedback").className = "feedback no";
    $("#q-feedback").innerHTML = `<b>${esc(current.a)}</b>`;
  }
  setTimeout(next, awaiting ? 0 : 700);
});

/* default to Train — the reference is the secondary mode now */
setMode("train");
