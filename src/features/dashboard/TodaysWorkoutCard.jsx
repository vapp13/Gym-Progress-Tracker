import { useNavigate } from 'react-router-dom';
import { PlayCircle, Zap } from 'lucide-react';
import { useWorkoutPlans } from '../../hooks/useWorkoutPlans';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { SkeletonCard } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';

function TodaysWorkoutCard() {
  const { plans, loading } = useWorkoutPlans();
  const navigate = useNavigate();

  if (loading) return <SkeletonCard />;

  const suggestedPlan = plans[0];

  return (
    <Card>
      <div className="card-icon-row">
        <span className="card-icon card-icon-primary"><Zap size={18} /></span>
        <span className="card-eyebrow">Today's Workout</span>
      </div>
      {suggestedPlan ? (
        <>
          <h3 style={{ margin: '10px 0 4px 0' }}>{suggestedPlan.name}</h3>
          <p style={{ margin: '0 0 14px 0', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textTransform: 'capitalize' }}>
            {suggestedPlan.goal} · {suggestedPlan.exercises?.length || 0} exercises
          </p>
          <Button
            variant="primary"
            icon={PlayCircle}
            onClick={() => navigate(`/plans/${suggestedPlan.id}/session`)}
          >
            Start Workout
          </Button>
        </>
      ) : (
        <EmptyState message="No plans yet — create one to get started." actionLabel="Create a plan" onAction={() => navigate('/plans/new')} />
      )}
    </Card>
  );
}

export default TodaysWorkoutCard;
