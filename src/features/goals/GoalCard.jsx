import { Trash2 } from 'lucide-react';
import ProgressBar from '../../components/ProgressBar';
import './GoalCard.css';

function calculatePercent(startValue, currentValue, targetValue) {
  const isDecreasing = targetValue < startValue;
  const numerator = isDecreasing ? startValue - currentValue : currentValue - startValue;
  const denominator = isDecreasing ? startValue - targetValue : targetValue - startValue;
  if (denominator === 0) return 0;
  return Math.max(0, Math.min(100, Math.round((numerator / denominator) * 100)));
}

function GoalCard({ goal, onClick, onDelete }) {
  const percent = calculatePercent(goal.startValue, goal.currentValue, goal.targetValue);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div className="goal-card">
      <button className="goal-card-main-button" onClick={onClick}>
        <div className="goal-card-header">
          <h3>{goal.type}</h3>
          <span className={`goal-status goal-status-${goal.status}`}>{goal.status}</span>
        </div>
        <p className="goal-card-values">
          {goal.currentValue} → {goal.targetValue}
        </p>
        <ProgressBar current={percent} target={100} color="var(--color-accent)" />
      </button>
      <button
        className="goal-card-delete"
        onClick={handleDelete}
        aria-label={`Delete ${goal.type} goal`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default GoalCard;
