import { collection, doc, getDoc, getDocs, query, orderBy, limit, startAfter, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { estimateOneRepMax, isCountableSet } from '../utils/oneRepMax';

export async function getPersonalRecords(userId) {
  const snapshot = await getDocs(collection(db, 'users', userId, 'personalRecords'));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Genuine Firestore-level pagination for the full Personal Records page —
// exercise count (400+) means a very active user could have a personal
// record for a large share of them. Ordered by heaviestWeight (desc) to
// match the sort order already used everywhere records are displayed.
export async function getPersonalRecordsPage(userId, pageSize, cursor = null) {
  const constraints = [orderBy('heaviestWeight', 'desc'), limit(pageSize)];
  if (cursor) constraints.splice(1, 0, startAfter(cursor));

  const q = query(collection(db, 'users', userId, 'personalRecords'), ...constraints);
  const snapshot = await getDocs(q);

  return {
    records: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    hasMore: snapshot.docs.length === pageSize,
  };
}

// Compares this session's best numbers for one exercise against the
// existing record and only overwrites fields that were actually beaten —
// so the stored record always reflects the true all-time best, not just
// "whatever happened last." Returns which fields were beaten this session,
// so the caller can surface "PRs achieved" on the workout itself.
export async function updatePersonalRecord(userId, exerciseId, exerciseName, sets, date) {
  const workingSets = sets.filter(isCountableSet);
  if (workingSets.length === 0) return null;

  const ref = doc(db, 'users', userId, 'personalRecords', exerciseId);
  const existingSnap = await getDoc(ref);
  const existing = existingSnap.exists() ? existingSnap.data() : {};

  const prevWeight = existing.heaviestWeight || 0;
  const prevReps = existing.bestReps || 0;
  const prevOneRM = existing.bestEstimated1RM || 0;
  const prevVolume = existing.bestSessionVolume || 0;

  let heaviestWeight = prevWeight;
  let bestReps = prevReps;
  let bestEstimated1RM = prevOneRM;
  let sessionVolume = 0;

  workingSets.forEach((set) => {
    sessionVolume += (set.weight || 0) * (set.reps || 0);
    if (set.weight > heaviestWeight) heaviestWeight = set.weight;
    if (set.reps > bestReps) bestReps = set.reps;

    const oneRM = estimateOneRepMax(set.weight, set.reps);
    if (oneRM && oneRM > bestEstimated1RM) bestEstimated1RM = oneRM;
  });

  const bestSessionVolume = Math.max(prevVolume, sessionVolume);

  await setDoc(ref, {
    exerciseName,
    heaviestWeight,
    bestReps,
    bestEstimated1RM,
    bestSessionVolume,
    updatedAt: date,
  });

  const beatenTypes = [];
  if (heaviestWeight > prevWeight) beatenTypes.push('weight');
  if (bestReps > prevReps) beatenTypes.push('reps');
  if (bestEstimated1RM > prevOneRM) beatenTypes.push('1RM');
  if (sessionVolume > prevVolume) beatenTypes.push('volume');

  return beatenTypes.length > 0 ? { exerciseId, exerciseName, types: beatenTypes } : null;
}
