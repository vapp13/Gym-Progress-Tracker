import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
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

// `updates` may use dot-notation keys (e.g. "measurements.waist") so a
// single nested field can be corrected without overwriting its siblings —
// updateDoc treats dot-notation keys as targeted field paths, unlike
// setDoc({ merge: true }), which would replace the whole nested map.
export async function updateMeasurement(userId, entryId, updates) {
  const entryDoc = doc(db, 'users', userId, 'bodyMeasurements', entryId);
  await updateDoc(entryDoc, updates);
}

export async function deleteMeasurement(userId, entryId) {
  const entryDoc = doc(db, 'users', userId, 'bodyMeasurements', entryId);
  await deleteDoc(entryDoc);
}