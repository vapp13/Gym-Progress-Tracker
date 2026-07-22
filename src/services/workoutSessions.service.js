import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { bumpPublicStreak, syncAchievements, syncTrainingActivity } from './publicProfile.service';
import { getUserProfile } from './userProfile.service';
import { saveExercisePerformance } from './exercisePerformance.service';
import { updatePersonalRecord } from './personalRecords.service';
import { isCountableSet, estimateOneRepMax } from '../utils/oneRepMax';

const sessionsRef = collection(db, 'workoutSessions');

export async function startSession(userId, planId = null, planName = null) {
  const docRef = await addDoc(sessionsRef, {
    userId,
    planId,
    planName,
    status: 'in-progress',
    exercises: [],
    notes: '',
    prsAchieved: [],
    startedAt: serverTimestamp(),
    completedAt: null,
  });
  return docRef.id;
}

// Looks for a session the user already has open (in-progress or paused),
// so re-entering a workout route resumes it instead of silently starting
// a duplicate.
export async function getActiveSession(userId) {
  const q = query(
    sessionsRef,
    where('userId', '==', userId),
    where('status', 'in', ['in-progress', 'paused']),
    orderBy('startedAt', 'desc'),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

export async function updateSession(sessionId, updates) {
  const sessionDoc = doc(db, 'workoutSessions', sessionId);
  await updateDoc(sessionDoc, updates);
}

export async function pauseSession(sessionId) {
  await updateSession(sessionId, { status: 'paused' });
}

export async function resumeSession(sessionId) {
  await updateSession(sessionId, { status: 'in-progress' });
}

export async function abandonSession(sessionId) {
  await updateSession(sessionId, { status: 'abandoned' });
}

function calculateVolume(sets) {
  return sets.reduce((total, set) => {
    if (!isCountableSet(set)) return total;
    return total + (set.reps || 0) * (set.weight || 0);
  }, 0);
}

async function writeProgressLogs(userId, exercises) {
  const logsRef = collection(db, 'users', userId, 'progressLogs');
  const today = new Date().toISOString().split('T')[0];

  const writes = exercises.map((ex) => {
    const workingSets = ex.sets.filter(isCountableSet);
    const volume = calculateVolume(ex.sets);

    let bestWeight = 0;
    let bestReps = 0;
    let bestEstimated1RM = 0;

    workingSets.forEach((set) => {
      if (set.weight > bestWeight) bestWeight = set.weight;
      if (set.reps > bestReps) bestReps = set.reps;
      const oneRM = estimateOneRepMax(set.weight, set.reps);
      if (oneRM && oneRM > bestEstimated1RM) bestEstimated1RM = oneRM;
    });

    return addDoc(logsRef, {
      date: today,
      exerciseId: ex.exerciseId,
      metric: 'volume',
      value: volume,
      bestWeight,
      bestReps,
      bestEstimated1RM,
      setCount: workingSets.length,
    });
  });

  await Promise.all(writes);
}

async function writePerformanceAndRecords(userId, exercises) {
  const today = new Date().toISOString().split('T')[0];

  const results = await Promise.all(
    exercises.map(async (ex) => {
      await saveExercisePerformance(userId, ex.exerciseId, ex.sets, today);
      return updatePersonalRecord(userId, ex.exerciseId, ex.exerciseName, ex.sets, today);
    })
  );

  return results.filter(Boolean);
}

export async function completeSession(sessionId, userId, exercises, notes = '', planName = null) {
  const prsAchieved = await writePerformanceAndRecords(userId, exercises);

  const sessionDoc = doc(db, 'workoutSessions', sessionId);
  await updateDoc(sessionDoc, {
    exercises,
    notes,
    prsAchieved,
    status: 'completed',
    completedAt: serverTimestamp(),
  });

  await writeProgressLogs(userId, exercises);
  const streak = await bumpPublicStreak(userId);
  await syncAchievements(userId, { streak, prJustAchieved: prsAchieved.length > 0 });

  // Only share the workout name with friends if the user has explicitly
  // opted in — checked against their own settings, not written otherwise.
  const profile = await getUserProfile(userId);
  const shareActivity = profile?.visibility?.trainingActivity === 'friends';
  await syncTrainingActivity(userId, shareActivity ? planName : null);
}

export async function getUserSessions(userId) {
  const q = query(
    sessionsRef,
    where('userId', '==', userId),
    orderBy('startedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Genuine Firestore-level pagination (limit + startAfter), used only by
// the Workout History list view — kept separate from getUserSessions
// above so the many other consumers that need the full list (Dashboard,
// streak/goal calculations, etc.) are completely unaffected.
export async function getUserSessionsPage(userId, pageSize, cursor = null) {
  const constraints = [
    where('userId', '==', userId),
    where('status', '==', 'completed'),
    orderBy('startedAt', 'desc'),
    limit(pageSize),
  ];
  if (cursor) constraints.splice(3, 0, startAfter(cursor));

  const q = query(sessionsRef, ...constraints);
  const snapshot = await getDocs(q);

  return {
    sessions: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    hasMore: snapshot.docs.length === pageSize,
  };
}
