import { useNavigate } from 'react-router-dom';
import { Play, Trash2 } from 'lucide-react';
import './PlanCard.css';

function PlanCard({ plan, onClick, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  const handleStart = (e) => {
    e.stopPropagation();
    navigate(`/plans/${plan.id}/session`);
  };

  return (
    <div className="plan-card">
      <button className="plan-card-main-button" onClick={onClick}>
        <div className="plan-card-main">
          <h3>{plan.name}</h3>
          <p className="plan-card-meta">
            {plan.goal} · {plan.daysPerWeek}x/week · {plan.sessionDuration} min
          </p>
        </div>
        <span className={`difficulty-tag difficulty-${plan.experienceLevel}`}>
          {plan.experienceLevel}
        </span>
      </button>
      <button className="plan-card-start" onClick={handleStart} aria-label={`Start ${plan.name}`}>
        <Play size={16} fill="currentColor" />
      </button>
      <button className="plan-card-delete" onClick={handleDelete} aria-label={`Delete ${plan.name}`}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default PlanCard;
