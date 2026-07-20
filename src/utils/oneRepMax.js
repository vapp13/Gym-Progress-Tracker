// Epley formula — the standard, simplest estimated-1RM calculation.
// Only meaningful for weighted sets with reps > 0; returns null otherwise
// (e.g. bodyweight sets with weight 0, or a set with 0 reps logged).
export function estimateOneRepMax(weight, reps) {
  if (!weight || !reps || reps <= 0) return null;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

// PRs and volume should only count sets that reflect real working effort.
// Warmup sets are excluded so they don't skew 1RM/volume/PR calculations.
export function isCountableSet(set) {
  return set.completed && set.type !== 'warmup';
}
