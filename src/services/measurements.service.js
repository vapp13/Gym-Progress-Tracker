import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

function measurementsRef(userId) {
  return collection(db, 'users', userId, 'bodyMeasurements');
}

export async function addMeasurement(userId, measurementData) {
  const docRef = await addDoc(measurementsRef(userId), {
    ...measurementData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getMeasurements(userId) {
  const q = query(measurementsRef(userId), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function deleteMeasurement(userId, entryId) {
  const entryDoc = doc(db, 'users', userId, 'bodyMeasurements', entryId);
  await deleteDoc(entryDoc);
}