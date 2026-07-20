function formatDate(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function ExerciseProgressStats({ logs, exerciseId, records }) {
  const exerciseLogs = logs.filter((log) => log.exerciseId === exerciseId);
  const record = records.find((r) => r.id === exerciseId);

  if (exerciseLogs.length === 0) return null;

  const totalSessions = exerciseLogs.length;
  const averageVolume = Math.round(
    exerciseLogs.reduce((sum, log) => sum + (log.value || 0), 0) / totalSessions
  );
  const lastPerformed = [...exerciseLogs].sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.date;

  return (
    <div className="stat-box-grid">
      <div className="stat-box">
        <span className="stat-box-value">{record?.heaviestWeight ?? '—'}<span className="stat-box-unit">kg</span></span>
        <span className="stat-box-label">Current Best Weight</span>
      </div>
      <div className="stat-box">
        <span className="stat-box-value">{record?.bestEstimated1RM ?? '—'}<span className="stat-box-unit">kg</span></span>
        <span className="stat-box-label">Estimated 1RM</span>
      </div>
      <div className="stat-box">
        <span className="stat-box-value">{totalSessions}</span>
        <span className="stat-box-label">Total Sessions</span>
      </div>
      <div className="stat-box">
        <span className="stat-box-value">{averageVolume.toLocaleString()}<span className="stat-box-unit">kg</span></span>
        <span className="stat-box-label">Avg. Training Volume</span>
      </div>
      <div className="stat-box" style={{ gridColumn: 'span 2' }}>
        <span className="stat-box-value" style={{ fontSize: 'var(--text-base)' }}>{formatDate(lastPerformed)}</span>
        <span className="stat-box-label">Last Performed</span>
      </div>
    </div>
  );
}

export default ExerciseProgressStats;
