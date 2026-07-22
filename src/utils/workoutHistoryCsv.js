import { toCsv } from './csv';
import { isCountableSet } from './oneRepMax';

function formatDate(timestamp) {
  return timestamp?.toDate ? timestamp.toDate().toISOString().split('T')[0] : '';
}

function sessionVolume(session) {
  return session.exercises.reduce((total, ex) => {
    return total + ex.sets.filter(isCountableSet).reduce((sum, s) => sum + (s.weight || 0) * (s.reps || 0), 0);
  }, 0);
}

function sessionDurationMinutes(session) {
  if (!session.startedAt?.toDate || !session.completedAt?.toDate) return '';
  return Math.round((session.completedAt.toDate() - session.startedAt.toDate()) / 60000);
}

// Session-level summary only, not a full per-set breakdown — a flat CSV
// row per session (with a nested list of sets per exercise) doesn't fit a
// simple table well. Full detail is still viewable/exportable per-session
// from the app itself if ever needed.
export function exportWorkoutHistoryToCsv(sessions) {
  const columns = [
    { label: 'Date', get: (s) => formatDate(s.completedAt) },
    { label: 'Workout Name', get: (s) => s.planName || 'Free Workout' },
    { label: 'Duration (min)', get: (s) => sessionDurationMinutes(s) },
    { label: 'Exercises', get: (s) => s.exercises.length },
    { label: 'Total Volume (kg)', get: (s) => Math.round(sessionVolume(s)) },
    { label: 'Personal Records', get: (s) => (s.prsAchieved || []).length },
    { label: 'Notes', get: (s) => s.notes || '' },
  ];

  const completedSessions = sessions.filter((s) => s.status === 'completed');
  return toCsv(completedSessions, columns);
}
