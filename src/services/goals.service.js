import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const goalsRef = collection(db, 'goals');

export async function createGoal(userId, goalData) {
  const docRef = await addDoc(goalsRef, {
    userId,
    ...goalData,
    status: 'active',
    isActive: false,
    archived: false,
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

export async function archiveGoal(goalId) {
  const goalDoc = doc(db, 'goals', goalId);
  await updateDoc(goalDoc, { archived: true, isActive: false, status: 'archived' });
}

export async function completeGoal(goalId) {
  const goalDoc = doc(db, 'goals', goalId);
  await updateDoc(goalDoc, { status: 'completed', isActive: false });
}

export async function unarchiveGoal(goalId) {
  const goalDoc = doc(db, 'goals', goalId);
  await updateDoc(goalDoc, { archived: false, status: 'active' });
}

// Exactly one goal can be "the" active goal at a time — this demotes any
// currently-active goal and promotes the chosen one in a single batch.
export async function setActiveGoal(userId, goalId) {
  const q = query(goalsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);

  const batch = writeBatch(db);
  snapshot.docs.forEach((docSnap) => {
    const shouldBeActive = docSnap.id === goalId;
    if (docSnap.data().isActive !== shouldBeActive) {
      batch.update(docSnap.ref, { isActive: shouldBeActive });
    }
  });
  await batch.commit();
}
