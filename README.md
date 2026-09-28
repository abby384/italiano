# italiano

An interactive Italian trainer built around spaced repetition, forced
production and rule-level error targeting — plus a reference cheat sheet.

**Live:** https://abby384.github.io/italiano/

## Why it's built this way

15 minutes a day will never buy you FSI-grade proficiency (they spend 600
hours). What it *can* buy is automatized structure and a core lexicon, so
that when you're actually talking to someone your attention is free for
meaning instead of conjugation. Every design decision follows from that.

- **Production only.** No multiple choice anywhere. Recognising a form is
  nearly worthless; producing it under time pressure is the skill.
- **Latency is graded.** Correct-but-slow and correct-and-instant are
  different memories and are scheduled differently.
- **Rule-level targeting.** Every item carries rule tags. Miss `lo zaino`
  and `lo studente` and the engine identifies the *lo/gli trigger set* as
  weak, not the two words, then over-serves that rule.
- **Fixed session shape.** Review → weak spot → new → production. The
  learner makes no decisions about what to study.
- **Hard stop at 15 minutes**, with an explicit opt-in to continue.

## Architecture

    engine/      language-agnostic: scheduler, session builder, storage
    courses/it/  all Italian content, as data
    train.js     trainer UI
    data.js      reference content
    app.js       reference UI

The engine knows nothing about Italian. A new language is a new file under
`courses/`.

- `engine/scheduler.js` — FSRS memory model (stability / difficulty /
  retrievability) with published default weights.
- `engine/session.js` — tier gating, weak-rule detection, in-session
  relearning, daily new-item caps.
- `engine/store.js` — one localStorage key, exportable as JSON.

No build step, no dependencies, no server, no account. Works offline.

## Course format

```js
{ id, tier, order, type, cue, sub, a, alt[], rules[], note? }
```

`type` is one of `chunk` (fixed expression), `prod` (free sentence
production), `form` (inflect a verb), `trans` (transform the given form),
`cloze` (supply the missing word).

## Status

Phase 1. Tiers 0–2 (survival frames, core verbs, regular conjugation,
articles, gender, plurals) — 262 items. Audio is designed for but not
populated: items take an optional `audio` field.
