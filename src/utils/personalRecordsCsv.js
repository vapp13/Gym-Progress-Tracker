import { toCsv } from './csv';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
}

// Personal records are derived/computed data (from your workout history),
// not something you'd manually re-enter — export-only, no import.
export function exportPersonalRecordsToCsv(records) {
  const columns = [
    { label: 'Exercise', get: (r) => r.exerciseName },
    { label: 'Heaviest Weight (kg)', get: (r) => r.heaviestWeight },
    { label: 'Best Reps', get: (r) => r.bestReps },
    { label: 'Estimated 1RM (kg)', get: (r) => r.bestEstimated1RM },
    { label: 'Best Session Volume (kg)', get: (r) => r.bestSessionVolume },
    { label: 'Achieved', get: (r) => formatDate(r.updatedAt) },
  ];

  return toCsv(records, columns);
}
