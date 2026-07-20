import { getUserSessions } from './workoutSessions.service';
import { saveExercisePerformance } from './exercisePerformance.service';
import { updatePersonalRecord } from './personalRecords.service';

// One-time (re-runnable) utility: rebuilds "previous performance" pointers
// and personal records from existing completed workout history. This is
// needed because those two collections didn't exist before this feature
// shipped, so anything logged earlier has no PR/previous-performance data
// until it's either re-logged or backfilled once via this function.
//
// Processes sessions oldest-to-newest so the final exercisePerformance
// snapshot correctly reflects the most recent session, and personal
// records accumulate the true all-time best across the full history.
export async function backfillPerformanceData(userId, onProgress) {
  const sessions = await getUserSessions(userId);
  const completed = sessions
    .filter((s) => s.status === 'completed' && s.completedAt && s.exercises?.length > 0)
    .sort((a, b) => a.completedAt.toDate() - b.completedAt.toDate());

  let processed = 0;

  for (const session of completed) {
    const date = session.completedAt.toDate().toISOString().split('T')[0];

    for (const ex of session.exercises) {
      if (!ex.sets || ex.sets.length === 0) continue;
      await saveExercisePerformance(userId, ex.exerciseId, ex.sets, date);
      await updatePersonalRecord(userId, ex.exerciseId, ex.exerciseName, ex.sets, date);
    }

    processed += 1;
    onProgress?.(processed, completed.length);
  }

  return { sessionsProcessed: processed };
}
