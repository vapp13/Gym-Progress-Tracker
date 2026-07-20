import FilterChip from '../../components/FilterChip';
import './PlanMetaForm.css';

const GOALS = ['strength', 'hypertrophy', 'endurance', 'weight-loss', 'general'];
const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced'];
const DAYS = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' },
];

function PlanMetaForm({ meta, onChange }) {
  const handleField = (field, value) => {
    onChange({ ...meta, [field]: value });
  };

  const toggleDay = (day) => {
    const current = meta.scheduledDays || [];
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    handleField('scheduledDays', updated);
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

      <div className="form-field">
        <span>Scheduled days (optional)</span>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', margin: '0 0 6px 0' }}>
          Assign specific days so this plan shows as "Today's Workout" automatically.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          {DAYS.map((day) => (
            <FilterChip
              key={day.value}
              label={day.label}
              active={(meta.scheduledDays || []).includes(day.value)}
              onClick={() => toggleDay(day.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlanMetaForm;