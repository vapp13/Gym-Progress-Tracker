import './PlanCard.css';

function PlanCard({ plan, onClick }) {
  return (
    <button className="plan-card" onClick={onClick}>
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
  );
}

export default PlanCard;