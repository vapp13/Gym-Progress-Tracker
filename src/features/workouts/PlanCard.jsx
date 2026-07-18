import './PlanCard.css';

function PlanCard({ plan, onClick, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
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
      <button
        className="plan-card-delete"
        onClick={handleDelete}
        aria-label={`Delete ${plan.name}`}
      >
        ✕
      </button>
    </div>
  );
}

export default PlanCard;