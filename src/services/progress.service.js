import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function getProgressLogs(userId) {
  const logsRef = collection(db, 'users', userId, 'progressLogs');
  const q = query(logsRef, orderBy('date', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}