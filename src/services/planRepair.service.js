import { getUserPlans, updatePlan } from './workoutPlans.service';
import { getExercises } from './exercises.service';
import { findMatchingExercise } from '../utils/exerciseMatching';

// Re-links plan exercises whose stored exerciseId no longer matches any
// document in the current exercise library (e.g. if the library was ever
// deleted/re-imported, which assigns brand-new Firestore document IDs to
// otherwise-identical exercises) — orphaned entries silently lose their
// info icon, difficulty tag, and muscle/equipment tags, since those are
// all looked up live by exerciseId, not stored on the plan itself.
//
// Repairs by re-matching the entry's stored exerciseName against the
// current library, reusing the same matcher built for templates. Entries
// that still can't be matched (name has no reasonable equivalent in the
// current library) are left as-is and counted separately, since guessing
// wrong would silently attach the wrong exercise.
export async function repairPlanExerciseLinks(userId) {
  const [plans, currentExercises] = await Promise.all([
    getUserPlans(userId),
    getExercises(),
  ]);

  const currentIds = new Set(currentExercises.map((ex) => ex.id));

  let plansRepaired = 0;
  let entriesRepaired = 0;
  let entriesUnmatched = 0;

  for (const plan of plans) {
    if (!plan.exercises || plan.exercises.length === 0) continue;

    let planChanged = false;

    const updatedExercises = plan.exercises.map((entry) => {
      if (currentIds.has(entry.exerciseId)) return entry;

      const match = findMatchingExercise(entry.exerciseName, currentExercises);
      if (!match) {
        entriesUnmatched += 1;
        return entry;
      }

      planChanged = true;
      entriesRepaired += 1;
      return { ...entry, exerciseId: match.id };
    });

    if (planChanged) {
      await updatePlan(plan.id, { exercises: updatedExercises });
      plansRepaired += 1;
    }
  }

  return { plansRepaired, entriesRepaired, entriesUnmatched };
}
