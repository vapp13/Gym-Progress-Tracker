import { isCountableSet } from './oneRepMax';

// Finds the most recent OTHER completed session using the same plan —
// comparisons are only meaningful between the same workout (e.g. Push Day
// vs a previous Push Day), never across different plans.
export function findPreviousSameplanSession(sessions, currentSession) {
  if (!currentSession.planId) return null;

  const candidates = sessions.filter((s) =>
    s.status === 'completed' &&
    s.planId === currentSession.planId &&
    s.id !== currentSession.id &&
    s.completedAt && currentSession.completedAt &&
    s.completedAt.toDate() < currentSession.completedAt.toDate()
  );

  // `sessions` is already ordered newest-first (getUserSessions), so the
  // first match after filtering is the closest prior session.
  return candidates[0] || null;
}

function computeExerciseStats(sets) {
  const working = (sets || []).filter(isCountableSet);
  let bestWeight = 0;
  let bestReps = 0;
  let volume = 0;

  working.forEach((set) => {
    volume += (set.weight || 0) * (set.reps || 0);
    if (set.weight > bestWeight) bestWeight = set.weight;
    if (set.reps > bestReps) bestReps = set.reps;
  });

  return { bestWeight, bestReps, volume };
}

function diff(current, previous) {
  const delta = Math.round((current - previous) * 10) / 10;
  return {
    current,
    previous,
    delta,
    direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'same',
  };
}

// Compares each exercise in the current session against the same exercise
// in the previous same-plan session (if it was performed there too).
export function compareSessionExercises(currentSession, previousSession) {
  if (!previousSession) return [];

  const previousByExercise = {};
  previousSession.exercises.forEach((ex) => {
    previousByExercise[ex.exerciseId] = ex;
  });

  return currentSession.exercises
    .filter((ex) => previousByExercise[ex.exerciseId])
    .map((ex) => {
      const currentStats = computeExerciseStats(ex.sets);
      const previousStats = computeExerciseStats(previousByExercise[ex.exerciseId].sets);

      return {
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        weight: diff(currentStats.bestWeight, previousStats.bestWeight),
        reps: diff(currentStats.bestReps, previousStats.bestReps),
        volume: diff(currentStats.volume, previousStats.volume),
      };
    });
}
