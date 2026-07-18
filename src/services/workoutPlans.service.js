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

const plansRef = collection(db, 'workoutPlans');

export async function createPlan(userId, planData) {
  const docRef = await addDoc(plansRef, {
    userId,
    ...planData,
    isArchived: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getUserPlans(userId) {
  const q = query(plansRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function updatePlan(planId, updates) {
  const planDoc = doc(db, 'workoutPlans', planId);
  await updateDoc(planDoc, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePlan(planId) {
  const planDoc = doc(db, 'workoutPlans', planId);
  await deleteDoc(planDoc);
}