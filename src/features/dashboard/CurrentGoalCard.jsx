import { useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import { useGoals } from '../../hooks/useGoals';
import { useMeasurements } from '../../hooks/useMeasurements';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import TrendIndicator from '../goals/TrendIndicator';
import { SkeletonCard } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import { calculateGoalProgress } from '../../utils/goalProgress';
import { isLegacyGoal, getGoalTypeConfig } from '../../utils/goalTypes';
import { getGoalRecommendation } from '../../utils/goalRecommendation';

function getGoalLabel(goal) {
  if (isLegacyGoal(goal)) return goal.type;
  return getGoalTypeConfig(goal.type)?.label || goal.type;
}

function CurrentGoalCard() {
  const { goals, loading } = useGoals();
  const { measurements, loading: measurementsLoading } = useMeasurements();
  const navigate = useNavigate();

  if (loading || measurementsLoading) return <SkeletonCard />;

  const activeGoal = goals.find((g) => g.isActive);
  const progress = activeGoal ? calculateGoalProgress(activeGoal, measurements) : null;

  return (
    <Card interactive onClick={() => activeGoal ? navigate(`/goals/${activeGoal.id}`) : navigate('/goals')}>
      <div className="card-icon-row">
        <span className="card-icon card-icon-primary"><Target size={18} /></span>
        <span className="card-eyebrow">Current Goal</span>
      </div>
      {activeGoal ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0 12px 0' }}>
            <h3 style={{ margin: 0 }}>{getGoalLabel(activeGoal)}</h3>
            <TrendIndicator trend={progress.trend} />
          </div>
          <ProgressBar
            current={progress.percent ?? 0}
            target={100}
          />
          <p style={{ margin: '10px 0 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            {getGoalRecommendation(activeGoal, measurements)}
          </p>
        </>
      ) : (
        <EmptyState message="No active goal yet." actionLabel="Set a goal" onAction={() => navigate('/goals')} />
      )}
    </Card>
  );
}

export default CurrentGoalCard;
