import ProgressBar from '../../components/ProgressBar';
import TrendIndicator from './TrendIndicator';
import { calculateGoalProgress } from '../../utils/goalProgress';
import { isLegacyGoal, getGoalTypeConfig } from '../../utils/goalTypes';
import './GoalCard.css';

function getGoalLabel(goal) {
  if (isLegacyGoal(goal)) return goal.type;
  return getGoalTypeConfig(goal.type)?.label || goal.type;
}

function getCurrentAndTarget(goal) {
  if (isLegacyGoal(goal)) {
    return { current: goal.currentValue, target: goal.targetValue };
  }
  return { current: goal.metrics?.current ?? goal.metrics?.start, target: goal.metrics?.target };
}

// Read-only summary for the Profile page — same visual language as the
// real Goal card, but with no click-through, no edit, and no actions.
// Reuses calculateGoalProgress rather than recomputing anything.
function ActiveGoalCard({ goal, measurements }) {
  const progress = calculateGoalProgress(goal, measurements);
  const { current, target } = getCurrentAndTarget(goal);

  return (
    <div className="goal-card">
      <div className="goal-card-main-button" style={{ cursor: 'default' }}>
        <div className="goal-card-header">
          <h3>{getGoalLabel(goal)}</h3>
          <TrendIndicator trend={progress.trend} />
        </div>

        {current !== undefined && target !== undefined && (
          <p className="goal-card-values">
            {current}{progress.unit} → {target}{progress.unit}
          </p>
        )}

        {progress.percent !== null && (
          <>
            <p className="goal-card-values">
              {progress.remaining !== null
                ? `${Math.abs(progress.remaining)}${progress.unit ? progress.unit : ''} remaining`
                : `${progress.percent}% through timeline`}
            </p>
            <ProgressBar current={progress.percent} target={100} color="var(--color-accent)" />
          </>
        )}
      </div>
    </div>
  );
}

export default ActiveGoalCard;
