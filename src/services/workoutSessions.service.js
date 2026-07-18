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

export async function completeSession(sessionId, exercises) {
  const sessionDoc = doc(db, 'workoutSessions', sessionId);
  await updateDoc(sessionDoc, {
    exercises,
    status: 'completed',
    completedAt: serverTimestamp(),
  });
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