import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, PlayCircle } from 'lucide-react';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import { useWorkoutSessions } from '../hooks/useWorkoutSessions';
import PlanCard from '../features/workouts/PlanCard';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';

function WorkoutPlans() {
  const { plans, loading, error, removePlan } = useWorkoutPlans();
  const { findActiveSession } = useWorkoutSessions();
  const [activeSession, setActiveSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    findActiveSession().then(setActiveSession);
  }, [findActiveSession]);

  if (error) return <p aria-live="assertive">Error: {error}</p>;

  const handleDelete = (planId, planName) => {
    if (window.confirm(`Delete "${planName}"? This can't be undone.`)) {
      removePlan(planId);
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Workout Plans" showBack sticky />

      <div style={{ marginBottom: 'var(--space-md)' }}>
        <Button variant="primary" icon={Plus} onClick={() => navigate('/plans/new')} style={{ width: '100%' }}>
          New Plan
        </Button>
      </div>

      {activeSession && (
        <button
          className="resume-banner"
          onClick={() => navigate(`/plans/${activeSession.planId}/session`)}
        >
          <PlayCircle size={20} />
          <span>
            You have a workout {activeSession.status === 'paused' ? 'paused' : 'in progress'} — tap to resume
          </span>
        </button>
      )}

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
        />
      ) : (
        <div>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onClick={() => navigate(`/plans/${plan.id}/edit`)}
              onDelete={() => handleDelete(plan.id, plan.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkoutPlans;
