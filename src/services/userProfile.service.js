import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function getUserProfile(userId) {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Merges partial updates into the user's document without touching
// unrelated fields (e.g. preferences, createdAt) already stored there.
export async function updateUserProfile(userId, updates) {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, updates, { merge: true });
}
