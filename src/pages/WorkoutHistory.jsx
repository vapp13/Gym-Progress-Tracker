import { useWorkoutSessions } from '../hooks/useWorkoutSessions';
import SessionSummaryCard from '../features/sessions/SessionSummaryCard';
import EmptyState from '../components/EmptyState';

function WorkoutHistory() {
  const { sessions, loading, error } = useWorkoutSessions();

  if (loading) return <p aria-live="polite">Loading history...</p>;
  if (error) return <p aria-live="assertive">Error: {error}</p>;

  const completedSessions = sessions.filter((s) => s.status === 'completed');

  return (
    <div className="page-container">
      <h1>Workout History</h1>

      {completedSessions.length === 0 ? (
        <EmptyState message="No completed workouts yet. Start one from your plans!" />
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