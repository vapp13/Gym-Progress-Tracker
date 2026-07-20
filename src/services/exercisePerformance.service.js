import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { isCountableSet } from '../utils/oneRepMax';

// A single cheap, overwritten-in-place doc per exercise, holding just the
// most recent working performance — this is the "Previous: 80kg x 8..."
// lookup, kept O(1) to read regardless of how much history exists.
export async function getExercisePerformance(userId, exerciseId) {
  const ref = doc(db, 'users', userId, 'exercisePerformance', exerciseId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function getExercisePerformanceBatch(userId, exerciseIds) {
  const uniqueIds = [...new Set(exerciseIds)];
  const entries = await Promise.all(
    uniqueIds.map(async (id) => [id, await getExercisePerformance(userId, id)])
  );
  return Object.fromEntries(entries.filter(([, value]) => value !== null));
}

export async function saveExercisePerformance(userId, exerciseId, sets, date) {
  const workingSets = sets.filter(isCountableSet).map((s) => ({
    weight: s.weight,
    reps: s.reps,
    type: s.type || 'working',
  }));

  if (workingSets.length === 0) return;

  const ref = doc(db, 'users', userId, 'exercisePerformance', exerciseId);
  await setDoc(ref, { sets: workingSets, date });
}
