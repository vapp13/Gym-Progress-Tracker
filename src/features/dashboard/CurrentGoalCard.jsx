import { useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import { useGoals } from '../../hooks/useGoals';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import { SkeletonCard } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';

function calculatePercent(startValue, currentValue, targetValue) {
  const isDecreasing = targetValue < startValue;
  const numerator = isDecreasing ? startValue - currentValue : currentValue - startValue;
  const denominator = isDecreasing ? startValue - targetValue : targetValue - startValue;
  if (!denominator) return 0;
  return Math.max(0, Math.min(100, Math.round((numerator / denominator) * 100)));
}

function CurrentGoalCard() {
  const { goals, loading } = useGoals();
  const navigate = useNavigate();

  if (loading) return <SkeletonCard />;

  const activeGoal = goals.find((g) => g.status === 'active');

  return (
    <Card interactive onClick={() => navigate('/goals')}>
      <div className="card-icon-row">
        <span className="card-icon card-icon-primary"><Target size={18} /></span>
        <span className="card-eyebrow">Current Goal</span>
      </div>
      {activeGoal ? (
        <>
          <h3 style={{ margin: '10px 0 12px 0', textTransform: 'capitalize' }}>{activeGoal.type}</h3>
          <ProgressBar
            current={calculatePercent(activeGoal.startValue, activeGoal.currentValue, activeGoal.targetValue)}
            target={100}
          />
        </>
      ) : (
        <EmptyState message="No active goal yet." actionLabel="Set a goal" onAction={() => navigate('/goals')} />
      )}
    </Card>
  );
}

export default CurrentGoalCard;
