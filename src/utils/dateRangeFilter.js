export const DATE_RANGES = [
  { value: '30d', label: 'Last 30 Days', days: 30 },
  { value: '3m', label: 'Last 3 Months', days: 90 },
  { value: '6m', label: 'Last 6 Months', days: 180 },
  { value: '1y', label: 'Last Year', days: 365 },
  { value: 'all', label: 'All Time', days: null },
];

// Client-side only — filters the already-fetched measurements array by
// date, purely to keep the graph readable. No extra Firestore reads.
export function filterByDateRange(measurements, rangeValue) {
  const range = DATE_RANGES.find((r) => r.value === rangeValue);
  if (!range || range.days === null) return measurements;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - range.days);

  return measurements.filter((entry) => new Date(entry.date) >= cutoff);
}
