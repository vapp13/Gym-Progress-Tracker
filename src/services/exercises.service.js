import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function getExercises() {
  const snapshot = await getDocs(collection(db, 'exercises'));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}