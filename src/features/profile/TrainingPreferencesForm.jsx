import { CalendarClock } from 'lucide-react';
import Card from '../../components/Card';
import { toTitleCase } from '../../utils/textFormatting';

const TIMES = ['morning', 'afternoon', 'evening'];
const EQUIPMENT = [
  { value: 'full-gym', label: 'Full Gym' },
  { value: 'home-gym', label: 'Home Gym' },
  { value: 'bodyweight', label: 'Bodyweight Only' },
];

function TrainingPreferencesForm({ value, onChange }) {
  const handleField = (field, val) => onChange({ ...value, [field]: val });

  return (
    <Card>
      <div className="card-icon-row">
        <span className="card-icon card-icon-primary"><CalendarClock size={18} /></span>
        <span className="card-eyebrow">Training Preferences</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
        <label className="form-field">
          <span>Days available per week</span>
          <input
            type="number"
            min="1"
            max="7"
            value={value.daysPerWeek}
            onChange={(e) => handleField('daysPerWeek', Number(e.target.value))}
          />
        </label>

        <label className="form-field">
          <span>Preferred session duration (minutes)</span>
          <input
            type="number"
            min="10"
            step="5"
            value={value.sessionDuration}
            onChange={(e) => handleField('sessionDuration', Number(e.target.value))}
          />
        </label>

        <label className="form-field">
          <span>Preferred training time</span>
          <select value={value.preferredTime} onChange={(e) => handleField('preferredTime', e.target.value)}>
            {TIMES.map((time) => (
              <option key={time} value={time}>{toTitleCase(time)}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Equipment availability</span>
          <select value={value.equipment} onChange={(e) => handleField('equipment', e.target.value)}>
            {EQUIPMENT.map((eq) => (
              <option key={eq.value} value={eq.value}>{eq.label}</option>
            ))}
          </select>
        </label>
      </div>
    </Card>
  );
}

export default TrainingPreferencesForm;
