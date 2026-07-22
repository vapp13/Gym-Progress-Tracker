import { useState } from 'react';
import { List, Calendar } from 'lucide-react';
import { useWorkoutSessions } from '../hooks/useWorkoutSessions';
import SessionSummaryCard from '../features/sessions/SessionSummaryCard';
import WorkoutCalendar from '../features/sessions/WorkoutCalendar';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';

function WorkoutHistory() {
  const { sessions, loading, error } = useWorkoutSessions();
  const [view, setView] = useState('list');

  if (error) return <p aria-live="assertive">Error: {error}</p>;

  const completedSessions = sessions.filter((s) => s.status === 'completed');

  return (
    <div className="page-container">
      <PageHeader
        title="Workout History"
        showBack
        sticky
        actions={
          <button
            className="session-icon-btn"
            onClick={() => setView((prev) => (prev === 'list' ? 'calendar' : 'list'))}
            aria-label={view === 'list' ? 'Switch to calendar view' : 'Switch to list view'}
          >
            {view === 'list' ? <Calendar size={18} /> : <List size={18} />}
          </button>
        }
      />

      {loading ? (
        <div aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map((i) => <Skeleton key={i} height="60px" radius="var(--radius-lg)" />)}
        </div>
      ) : completedSessions.length === 0 ? (
        <EmptyState message="No completed workouts yet. Start one from your plans!" />
      ) : view === 'calendar' ? (
        <WorkoutCalendar sessions={completedSessions} />
      ) : (
        <div>
          {completedSessions.map((session) => (
            <SessionSummaryCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkoutHistory;
