import './PlanMetaForm.css';

const GOALS = ['strength', 'hypertrophy', 'endurance', 'weight-loss', 'general'];
const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced'];

function PlanMetaForm({ meta, onChange }) {
  const handleField = (field, value) => {
    onChange({ ...meta, [field]: value });
  };

  return (
    <div className="plan-meta-form">
      <label className="form-field">
        <span>Plan name</span>
        <input
          type="text"
          value={meta.name}
          onChange={(e) => handleField('name', e.target.value)}
          placeholder="e.g. Push Pull Legs"
        />
      </label>

      <label className="form-field">
        <span>Training goal</span>
        <select
          value={meta.goal}
          onChange={(e) => handleField('goal', e.target.value)}
        >
          {GOALS.map((goal) => (
            <option key={goal} value={goal}>{goal}</option>
          ))}
        </select>
      </label>

      <label className="form-field">
        <span>Days per week</span>
        <input
          type="number"
          min="1"
          max="7"
          value={meta.daysPerWeek}
          onChange={(e) => handleField('daysPerWeek', Number(e.target.value))}
        />
      </label>

      <label className="form-field">
        <span>Session duration (minutes)</span>
        <input
          type="number"
          min="10"
          step="5"
          value={meta.sessionDuration}
          onChange={(e) => handleField('sessionDuration', Number(e.target.value))}
        />
      </label>

      <label className="form-field">
        <span>Experience level</span>
        <select
          value={meta.experienceLevel}
          onChange={(e) => handleField('experienceLevel', e.target.value)}
        >
          {EXPERIENCE_LEVELS.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default PlanMetaForm;