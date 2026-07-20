import { Zap } from 'lucide-react';
import Card from '../../components/Card';
import { toTitleCase } from '../../utils/textFormatting';

const GOALS = [
  { value: 'lose-weight', label: 'Lose Weight' },
  { value: 'build-muscle', label: 'Build Muscle' },
  { value: 'strength', label: 'Strength' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'maintain', label: 'Maintain' },
];

const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced'];
const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary (little to no exercise)' },
  { value: 'light', label: 'Light (1-3 days/week)' },
  { value: 'moderate', label: 'Moderate (3-5 days/week)' },
  { value: 'active', label: 'Active (6-7 days/week)' },
  { value: 'very-active', label: 'Very Active (physical job or 2x/day)' },
];

function FitnessInfoForm({ value, onChange }) {
  const handleField = (field, val) => onChange({ ...value, [field]: val });

  return (
    <Card>
      <div className="card-icon-row">
        <span className="card-icon card-icon-primary"><Zap size={18} /></span>
        <span className="card-eyebrow">Fitness Information</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
        <label className="form-field">
          <span>Main goal</span>
          <select value={value.goal} onChange={(e) => handleField('goal', e.target.value)}>
            {GOALS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Experience level</span>
          <select value={value.experienceLevel} onChange={(e) => handleField('experienceLevel', e.target.value)}>
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level} value={level}>{toTitleCase(level)}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Activity level</span>
          <select value={value.activityLevel || 'moderate'} onChange={(e) => handleField('activityLevel', e.target.value)}>
            {ACTIVITY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </label>
      </div>
    </Card>
  );
}

export default FitnessInfoForm;
