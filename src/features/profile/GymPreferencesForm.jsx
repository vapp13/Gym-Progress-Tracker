import { MapPin } from 'lucide-react';
import Card from '../../components/Card';
import FilterChip from '../../components/FilterChip';

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const TIMES = ['morning', 'afternoon', 'evening'];

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function GymPreferencesForm({ value, onChange }) {
  const handleField = (field, val) => onChange({ ...value, [field]: val });

  return (
    <Card>
      <div className="card-icon-row">
        <span className="card-icon card-icon-primary"><MapPin size={18} /></span>
        <span className="card-eyebrow">Gym Preferences</span>
      </div>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', margin: '4px 0 0 0' }}>
        Optional — used for future training partner matching. No exact address is ever stored.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
        <label className="form-field">
          <span>City / area</span>
          <input
            type="text"
            placeholder="e.g. Bristol, UK"
            value={value.cityArea || ''}
            onChange={(e) => handleField('cityArea', e.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Preferred gym(s)</span>
          <input
            type="text"
            placeholder="e.g. PureGym Bristol, Anytime Fitness"
            value={value.preferredGymsText ?? ''}
            onChange={(e) => handleField('preferredGymsText', e.target.value)}
          />
        </label>

        <div className="form-field">
          <span>Typical training days</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginTop: 4 }}>
            {DAYS.map((day) => (
              <FilterChip
                key={day}
                label={day}
                active={(value.typicalDays || []).includes(day)}
                onClick={() => handleField('typicalDays', toggleValue(value.typicalDays || [], day))}
              />
            ))}
          </div>
        </div>

        <div className="form-field">
          <span>Typical training times</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginTop: 4 }}>
            {TIMES.map((time) => (
              <FilterChip
                key={time}
                label={time}
                active={(value.typicalTimes || []).includes(time)}
                onClick={() => handleField('typicalTimes', toggleValue(value.typicalTimes || [], time))}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default GymPreferencesForm;
