import { Trash2, Star, Archive, RotateCcw } from 'lucide-react';
import ProgressBar from '../../components/ProgressBar';
import TrendIndicator from './TrendIndicator';
import { calculateGoalProgress } from '../../utils/goalProgress';
import { isLegacyGoal, getGoalTypeConfig } from '../../utils/goalTypes';
import { getGoalBucket } from '../../utils/goalBucket';
import './GoalCard.css';

function getGoalLabel(goal) {
  if (isLegacyGoal(goal)) return goal.type;
  return getGoalTypeConfig(goal.type)?.label || goal.type;
}

function GoalCard({ goal, onClick, onDelete, onArchive, onSetActive, onReactivate }) {
  const progress = calculateGoalProgress(goal);
  const bucket = getGoalBucket(goal);

  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div className={`goal-card ${goal.isActive ? 'goal-card-active' : ''}`}>
      <button className="goal-card-main-button" onClick={onClick}>
        <div className="goal-card-header">
          <h3>
            {goal.isActive && <Star size={14} fill="currentColor" className="goal-card-active-star" />}
            {getGoalLabel(goal)}
          </h3>
          <TrendIndicator trend={progress.trend} />
        </div>
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
      </button>

      <div className="goal-card-actions">
        {bucket === 'active' && !goal.isActive && (
          <button
            className="goal-card-action-btn goal-card-action-star"
            onClick={stop(onSetActive)}
            aria-label="Set as Active Goal"
            title="Set as Active Goal"
          >
            <Star size={16} />
          </button>
        )}
        {bucket === 'active' && (
          <button
            className="goal-card-action-btn"
            onClick={stop(onArchive)}
            aria-label="Archive Goal"
            title="Archive Goal"
          >
            <Archive size={16} />
          </button>
        )}
        {bucket !== 'active' && (
          <button
            className="goal-card-action-btn goal-card-action-restore"
            onClick={stop(onReactivate)}
            aria-label="Reactivate Goal"
            title="Reactivate Goal"
          >
            <RotateCcw size={16} />
          </button>
        )}
        <button
          className="goal-card-action-btn goal-card-action-delete"
          onClick={stop(onDelete)}
          aria-label="Delete Goal"
          title="Delete Goal"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default GoalCard;
