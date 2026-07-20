import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, PlayCircle, Dumbbell, Zap, History } from 'lucide-react';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import { useWorkoutSessions } from '../hooks/useWorkoutSessions';
import PlanCard from '../features/workouts/PlanCard';
import SessionSummaryCard from '../features/sessions/SessionSummaryCard';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import ConfirmModal from '../components/ConfirmModal';
import Skeleton from '../components/Skeleton';
import { sessionRoute } from '../utils/sessionRoute';

const RECENT_WORKOUTS_LIMIT = 5;

function WorkoutPlans() {
  const { plans, loading, error, removePlan } = useWorkoutPlans();
  const { sessions, loading: sessionsLoading, findActiveSession } = useWorkoutSessions();
  const [activeSession, setActiveSession] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    findActiveSession().then(setActiveSession);
  }, [findActiveSession]);

  if (error) return <p aria-live="assertive">Error: {error}</p>;

  // `sessions` is already sorted newest-first by the service, and free
  // workouts are stored as regular completed sessions (planName: "Free
  // Workout"), so no extra filtering/logic is needed for either case.
  const recentWorkouts = sessions
    .filter((s) => s.status === 'completed')
    .slice(0, RECENT_WORKOUTS_LIMIT);

  const confirmDelete = () => {
    if (pendingDelete) removePlan(pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <div className="page-container">
      <PageHeader title="Workout Plans" showBack sticky />

      <div style={{ marginBottom: 'var(--space-md)' }}>
        <Button variant="primary" icon={PlayCircle} onClick={() => navigate('/free-workout')} style={{ width: '100%' }}>
          Start Free Workout
        </Button>
      </div>

      {activeSession && (
        <button
          className="resume-banner"
          onClick={() => navigate(sessionRoute(activeSession))}
        >
          <PlayCircle size={20} />
          <span>
            You have a workout {activeSession.status === 'paused' ? 'paused' : 'in progress'} — tap to resume
          </span>
        </button>
      )}

      <div className="section-title">Plans</div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
        <Button variant="secondary" icon={Plus} onClick={() => navigate('/plans/new')} style={{ flex: 1 }}>
          New Plan
        </Button>
        <Button variant="secondary" icon={Dumbbell} onClick={() => navigate('/exercises')} style={{ flex: 1 }}>
          Exercises
        </Button>
      </div>

      {loading ? (
        <div aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height="66px" radius="var(--radius-lg)" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <EmptyState
          message="You haven't created any workout plans yet."
          actionLabel="Create your first plan"
          onAction={() => navigate('/plans/new')}
          icon={Zap}
        />
      ) : (
        <div>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onClick={() => navigate(`/plans/${plan.id}/edit`)}
              onDelete={() => setPendingDelete(plan)}
            />
          ))}
        </div>
      )}

      <div className="section-title">Recent Workouts</div>

      {sessionsLoading ? (
        <div aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2].map((i) => (
            <Skeleton key={i} height="60px" radius="var(--radius-lg)" />
          ))}
        </div>
      ) : recentWorkouts.length === 0 ? (
        <EmptyState message="No completed workouts yet. Finish a workout to see it here." icon={History} />
      ) : (
        <div>
          {recentWorkouts.map((session) => (
            <SessionSummaryCard key={session.id} session={session} />
          ))}
        </div>
      )}

      <div style={{ marginTop: 'var(--space-sm)' }}>
        <Button variant="secondary" icon={History} onClick={() => navigate('/history')} style={{ width: '100%' }}>
          View Full Workout History
        </Button>
      </div>

      <ConfirmModal
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Plan"
        message={`Delete "${pendingDelete?.name}"? This can't be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

export default WorkoutPlans;
