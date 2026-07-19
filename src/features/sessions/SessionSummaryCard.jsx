import { CheckCircle2 } from 'lucide-react';
import './SessionSummaryCard.css';

function formatDuration(startedAt, completedAt) {
  if (!startedAt || !completedAt) return null;
  const start = startedAt.toDate();
  const end = completedAt.toDate();
  const minutes = Math.round((end - start) / 60000);
  return `${minutes} min`;
}

function SessionSummaryCard({ session }) {
  const date = session.startedAt?.toDate().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const duration = formatDuration(session.startedAt, session.completedAt);

  return (
    <div className="session-summary-card">
      <span className="card-icon card-icon-success"><CheckCircle2 size={18} /></span>
      <div className="session-summary-main">
        <h3>{date}</h3>
        <p className="session-summary-meta">
          {session.exercises.length} exercise{session.exercises.length !== 1 ? 's' : ''}
          {duration && ` · ${duration}`}
        </p>
      </div>
    </div>
  );
}

export default SessionSummaryCard;
