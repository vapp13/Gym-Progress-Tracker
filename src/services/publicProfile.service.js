import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function getPublicProfile(userId) {
  const ref = doc(db, 'publicProfiles', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Creates the public doc if it doesn't exist yet — covers both brand-new
// sign-ups and users who existed before this feature shipped, so everyone
// ends up with a Friend-Code-lookupable public profile without a manual
// data migration step.
export async function ensurePublicProfile(userId, { displayName, photoURL }) {
  const ref = doc(db, 'publicProfiles', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: displayName || null,
      photoURL: photoURL || null,
      streak: 0,
      lastWorkoutDate: null,
      achievements: [],
    });
  }
}

// Keeps the public-facing doc (name/photo) in sync whenever the owner
// updates their profile. Never touches streak/achievements here.
export async function syncPublicProfileBasics(userId, { displayName, photoURL }) {
  const ref = doc(db, 'publicProfiles', userId);
  await setDoc(ref, { displayName, photoURL }, { merge: true });
}

// Incrementally updates the denormalized streak whenever a workout
// session completes, without needing to re-read full session history.
export async function bumpPublicStreak(userId) {
  const ref = doc(db, 'publicProfiles', userId);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data() : {};

  const todayKey = new Date().toISOString().split('T')[0];
  const lastDateKey = existing.lastWorkoutDate || null;

  let streak = existing.streak || 0;

  if (lastDateKey === todayKey) {
    // Already logged a workout today — streak doesn't change twice in one day.
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];

    streak = lastDateKey === yesterdayKey ? streak + 1 : 1;
  }

  await setDoc(
    ref,
    { streak, lastWorkoutDate: todayKey, achievements: existing.achievements || [] },
    { merge: true }
  );
}
