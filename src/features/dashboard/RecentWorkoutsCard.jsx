import { useNavigate } from 'react-router-dom';
import { History } from 'lucide-react';
import { useWorkoutSessions } from '../../hooks/useWorkoutSessions';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { SkeletonCard } from '../../components/Skeleton';

function formatDate(timestamp) {
  if (!timestamp?.toDate) return '';
  return timestamp.toDate().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function RecentWorkoutsCard() {
  const { sessions, loading } = useWorkoutSessions();
  const navigate = useNavigate();

  if (loading) return <SkeletonCard />;

  const recent = sessions.filter((s) => s.status === 'completed').slice(0, 3);

  return (
    <Card interactive onClick={() => navigate('/history')}>
      <div className="card-icon-row">
        <span className="card-icon card-icon-primary"><History size={18} /></span>
        <span className="card-eyebrow">Recent Workouts</span>
      </div>
      {recent.length === 0 ? (
        <div style={{ marginTop: 12 }}>
          <EmptyState message="No completed workouts yet." />
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: '12px 0 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recent.map((s) => (
            <li key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
              <span>{formatDate(s.completedAt)}</span>
              <span style={{ color: 'var(--color-text-muted)' }}>{s.exercises.length} exercises</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default RecentWorkoutsCard;
