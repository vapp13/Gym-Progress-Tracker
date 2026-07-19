import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import PlanCard from '../features/workouts/PlanCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';

function WorkoutPlans() {
  const { plans, loading, error, removePlan } = useWorkoutPlans();
  const navigate = useNavigate();

  if (error) return <p aria-live="assertive">Error: {error}</p>;

  const handleDelete = (planId, planName) => {
    if (window.confirm(`Delete "${planName}"? This can't be undone.`)) {
      removePlan(planId);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Workout Plans</h1>
        <Button variant="primary" icon={Plus} onClick={() => navigate('/plans/new')}>
          New Plan
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
