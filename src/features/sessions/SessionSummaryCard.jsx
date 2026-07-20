import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Trophy } from 'lucide-react';
import { isCountableSet } from '../../utils/oneRepMax';
import './SessionSummaryCard.css';

function formatDuration(startedAt, completedAt) {
  if (!startedAt || !completedAt) return null;
  const start = startedAt.toDate();
  const end = completedAt.toDate();
  const minutes = Math.round((end - start) / 60000);
  return `${minutes} min`;
}

function calculateSessionVolume(exercises) {
  return exercises.reduce((total, ex) => {
    const exVolume = ex.sets
      .filter(isCountableSet)
      .reduce((sum, set) => sum + (set.weight || 0) * (set.reps || 0), 0);
    return total + exVolume;
  }, 0);
}

function SessionSummaryCard({ session }) {
  const navigate = useNavigate();
  const date = session.startedAt?.toDate().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const duration = formatDuration(session.startedAt, session.completedAt);
  const volume = calculateSessionVolume(session.exercises);
  const prCount = session.prsAchieved?.length || 0;

  return (
    <button className="session-summary-card" onClick={() => navigate(`/history/${session.id}`)}>
      <span className="card-icon card-icon-success"><CheckCircle2 size={18} /></span>
      <div className="session-summary-main">
        <h3>{session.planName || date}</h3>
        <p className="session-summary-meta">
          {session.planName ? `${date} · ` : ''}
          {session.exercises.length} exercise{session.exercises.length !== 1 ? 's' : ''}
          {duration && ` · ${duration}`}
          {volume > 0 && ` · ${Math.round(volume).toLocaleString()}kg`}
        </p>
        {session.notes && <p className="session-summary-notes">"{session.notes}"</p>}
      </div>
      {prCount > 0 && (
        <span className="session-summary-pr-badge">
          <Trophy size={12} /> {prCount} PR{prCount !== 1 ? 's' : ''}
        </span>
      )}
    </button>
  );
}

export default SessionSummaryCard;
