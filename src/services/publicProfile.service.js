import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getNewlyEarnedAchievements } from '../utils/achievements';

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
      prCount: 0,
      goalsCompletedCount: 0,
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
// Returns the new streak value so callers (e.g. achievement syncing)
// don't need a second read.
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

  return streak;
}

// Shares (or clears) the most recent workout's name with friends, but
// only ever called with a value when the user's own visibility setting
// permits it — the check happens at the call site, not here, so this
// stays a simple write.
export async function syncTrainingActivity(userId, lastWorkoutName) {
  const ref = doc(db, 'publicProfiles', userId);
  await setDoc(ref, { lastWorkoutName: lastWorkoutName || null }, { merge: true });
}

// Recomputes achievements from current stats and writes only the newly
// earned ones — called after any moment that could unlock one (finishing
// a workout, completing a goal). `deltas` lets callers report a PR or
// goal completion just achieved without a second read of those collections.
export async function syncAchievements(userId, { streak, prJustAchieved, goalJustCompleted } = {}) {
  const ref = doc(db, 'publicProfiles', userId);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data() : {};

  const prCount = (existing.prCount || 0) + (prJustAchieved ? 1 : 0);
  const goalsCompletedCount = (existing.goalsCompletedCount || 0) + (goalJustCompleted ? 1 : 0);
  const existingAchievements = existing.achievements || [];
  const existingKeys = existingAchievements.map((a) => a.key);

  const newlyEarned = getNewlyEarnedAchievements(
    { streak: streak ?? existing.streak ?? 0, prCount, goalsCompletedCount },
    existingKeys
  );

  const updates = { prCount, goalsCompletedCount };
  if (newlyEarned.length > 0) {
    updates.achievements = [
      ...existingAchievements,
      ...newlyEarned.map((a) => ({ key: a.key, label: a.label, earnedAt: new Date().toISOString() })),
    ];
  }

  await setDoc(ref, updates, { merge: true });
  return newlyEarned;
}
