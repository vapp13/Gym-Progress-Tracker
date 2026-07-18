import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const goalsRef = collection(db, 'goals');

export async function createGoal(userId, goalData) {
  const docRef = await addDoc(goalsRef, {
    userId,
    ...goalData,
    status: 'active',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getUserGoals(userId) {
  const q = query(goalsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function updateGoal(goalId, updates) {
  const goalDoc = doc(db, 'goals', goalId);
  await updateDoc(goalDoc, updates);
}

export async function deleteGoal(goalId) {
  const goalDoc = doc(db, 'goals', goalId);
  await deleteDoc(goalDoc);
}