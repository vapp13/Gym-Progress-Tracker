import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const sessionsRef = collection(db, 'workoutSessions');

export async function startSession(userId, planId = null) {
  const docRef = await addDoc(sessionsRef, {
    userId,
    planId,
    status: 'in-progress',
    exercises: [],
    startedAt: serverTimestamp(),
    completedAt: null,
  });
  return docRef.id;
}

export async function updateSession(sessionId, updates) {
  const sessionDoc = doc(db, 'workoutSessions', sessionId);
  await updateDoc(sessionDoc, updates);
}

function calculateVolume(sets) {
  return sets.reduce((total, set) => {
    if (!set.completed) return total;
    return total + (set.reps || 0) * (set.weight || 0);
  }, 0);
}

async function writeProgressLogs(userId, exercises) {
  const logsRef = collection(db, 'users', userId, 'progressLogs');
  const today = new Date().toISOString().split('T')[0];

  const writes = exercises.map((ex) => {
    const volume = calculateVolume(ex.sets);
    return addDoc(logsRef, {
      date: today,
      exerciseId: ex.exerciseId,
      metric: 'volume',
      value: volume,
    });
  });

  await Promise.all(writes);
}

export async function completeSession(sessionId, userId, exercises) {
  const sessionDoc = doc(db, 'workoutSessions', sessionId);
  await updateDoc(sessionDoc, {
    exercises,
    status: 'completed',
    completedAt: serverTimestamp(),
  });

  await writeProgressLogs(userId, exercises);
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