import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

function logsRef(userId) {
  return collection(db, 'users', userId, 'goalProgressLogs');
}

// One flexible, reusable log for whatever supplementary metric a goal
// type calls for (VO2 max, HRV, blood pressure, cardio minutes, stretching
// sessions, etc.) — avoids needing a bespoke field/collection per metric.
export async function addProgressLogEntry(userId, goalId, { metricKey, value, note, date }) {
  const docRef = await addDoc(logsRef(userId), {
    goalId,
    metricKey,
    value,
    note: note || '',
    date,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getGoalProgressLogs(userId, goalId) {
  const q = query(logsRef(userId), where('goalId', '==', goalId), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteProgressLogEntry(userId, entryId) {
  await deleteDoc(doc(db, 'users', userId, 'goalProgressLogs', entryId));
}
