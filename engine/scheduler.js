/* FSRS-lite — free spaced repetition scheduler.
 *
 * Language-agnostic. Implements the FSRS memory model (stability /
 * difficulty / retrievability) with the published default weights.
 *
 * Grades: 1 = again, 2 = hard, 3 = good, 4 = easy.
 * The drill UI produces these from (correct?, latency) — see gradeFrom().
 */

const W = [
  0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.0310,
  1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.5870, 0.2272, 2.8755
];

const FACTOR = 19 / 81;
const DECAY = -0.5;
export const DESIRED_RETENTION = 0.9;

const clampD = d => Math.min(10, Math.max(1, d));
const clampS = s => Math.min(36500, Math.max(0.01, s));

/** Retrievability: probability of recall after `t` days at stability `s`. */
export function retrievability(t, s) {
  if (s <= 0) return 0;
  return Math.pow(1 + FACTOR * (t / s), DECAY);
}

/** Days until retrievability decays to the desired retention. */
export function intervalFor(stability, retention = DESIRED_RETENTION) {
  const days = (stability / FACTOR) * (Math.pow(retention, 1 / DECAY) - 1);
  return Math.max(1, Math.round(days));
}

const initStability = g => clampS(W[g - 1]);
const initDifficulty = g => clampD(W[4] - (g - 3) * W[5]);

function nextDifficulty(d, g) {
  const delta = d - W[6] * (g - 3);
  // mean reversion toward the "easy" baseline keeps difficulty from drifting
  return clampD(W[7] * initDifficulty(4) + (1 - W[7]) * delta);
}

function stabilityOnSuccess(d, s, r, g) {
  const hard = g === 2 ? W[15] : 1;
  const easy = g === 4 ? W[16] : 1;
  const inc =
    Math.exp(W[8]) *
    (11 - d) *
    Math.pow(s, -W[9]) *
    (Math.exp(W[10] * (1 - r)) - 1) *
    hard * easy;
  return clampS(s * (1 + inc));
}

function stabilityOnLapse(d, s, r) {
  return clampS(
    W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r))
  );
}

/**
 * Advance a card's memory state.
 * @param {object|null} card  null (or reps 0) means first exposure
 * @param {number} grade      1..4
 * @param {number} elapsedDays days since the card was last reviewed
 */
export function review(card, grade, elapsedDays = 0) {
  if (!card || !card.reps) {
    const s = initStability(grade);
    const d = initDifficulty(grade);
    return { s, d, reps: 1, lapses: grade === 1 ? 1 : 0, interval: intervalFor(s) };
  }
  const r = retrievability(elapsedDays, card.s);
  const d = nextDifficulty(card.d, grade);
  const s = grade === 1
    ? stabilityOnLapse(card.d, card.s, r)
    : stabilityOnSuccess(card.d, card.s, r, grade);
  return {
    s, d,
    reps: card.reps + 1,
    lapses: card.lapses + (grade === 1 ? 1 : 0),
    interval: intervalFor(s)
  };
}

/**
 * Map a drill result onto an FSRS grade.
 * Latency matters: a correct-but-slow answer is not the same memory as a
 * correct-and-instant one, and grading them identically is how apps end up
 * over-scheduling things you actually own.
 */
export function gradeFrom(correct, latencyMs, fastMs = 3000, slowMs = 8000) {
  if (!correct) return 1;
  if (latencyMs <= fastMs) return 4;
  if (latencyMs >= slowMs) return 2;
  return 3;
}
