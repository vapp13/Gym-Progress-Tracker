import { useState } from 'react';
import { List, Calendar } from 'lucide-react';
import { useWorkoutSessions } from '../hooks/useWorkoutSessions';
import { usePaginatedWorkoutSessions } from '../hooks/usePaginatedWorkoutSessions';
import SessionSummaryCard from '../features/sessions/SessionSummaryCard';
import WorkoutCalendar from '../features/sessions/WorkoutCalendar';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';

function WorkoutHistory() {
  const [view, setView] = useState('list');

  // List view is genuinely paginated (Firestore limit/startAfter) since
  // history can grow unbounded. Calendar view needs the full history to
  // show dots across any month navigated to, so it uses the regular
  // full-fetch hook — only whichever hook backs the active view actually
  // gets used for rendering, the other simply sits unused.
  const paginated = usePaginatedWorkoutSessions();
  const full = useWorkoutSessions();

  const error = view === 'list' ? paginated.error : full.error;
  if (error) return <p aria-live="assertive">Error: {error}</p>;

  const fullCompletedSessions = full.sessions.filter((s) => s.status === 'completed');

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

      {view === 'calendar' ? (
        full.loading ? (
          <div aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1, 2, 3].map((i) => <Skeleton key={i} height="60px" radius="var(--radius-lg)" />)}
          </div>
        ) : fullCompletedSessions.length === 0 ? (
          <EmptyState message="No completed workouts yet. Start one from your plans!" />
        ) : (
          <WorkoutCalendar sessions={fullCompletedSessions} />
        )
      ) : paginated.loading ? (
        <div aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map((i) => <Skeleton key={i} height="60px" radius="var(--radius-lg)" />)}
        </div>
      ) : paginated.sessions.length === 0 ? (
        <EmptyState message="No completed workouts yet. Start one from your plans!" />
      ) : (
        <>
          <div>
            {paginated.sessions.map((session) => (
              <SessionSummaryCard key={session.id} session={session} />
            ))}
          </div>
          {paginated.hasMore && (
            <Button
              variant="secondary"
              onClick={paginated.loadMore}
              disabled={paginated.loadingMore}
              style={{ width: '100%', marginTop: 'var(--space-sm)' }}
            >
              {paginated.loadingMore ? 'Loading...' : 'Load More'}
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default WorkoutHistory;
