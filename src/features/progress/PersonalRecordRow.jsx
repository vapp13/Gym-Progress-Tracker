function formatDate(dateString) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// Shared row markup — used by both the Profile page's top-7 summary and
// the full paginated Personal Records page, so the two stay visually
// identical without duplicating this markup.
function PersonalRecordRow({ record }) {
  return (
    <li style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 12, borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
        <span>{record.exerciseName}</span>
        <span style={{ color: 'var(--color-accent)' }}>{record.heaviestWeight}kg</span>
      </div>
      <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
        Est. 1RM {record.bestEstimated1RM}kg · Best set {record.bestReps} reps · Best session volume {record.bestSessionVolume}kg
      </p>
      {formatDate(record.updatedAt) && (
        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
          Achieved {formatDate(record.updatedAt)}
        </p>
      )}
    </li>
  );
}

export default PersonalRecordRow;
