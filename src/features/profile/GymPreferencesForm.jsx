import { useState } from 'react';
import { MapPin } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import FilterChip from '../../components/FilterChip';
import { toArray } from '../../utils/textFormatting';

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const TIMES = ['morning', 'afternoon', 'evening'];

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function GymPreferencesForm({ gymPreferences, onSave }) {
  const [cityArea, setCityArea] = useState(gymPreferences.cityArea || '');
  const [gymsText, setGymsText] = useState((gymPreferences.preferredGyms || []).join(', '));
  const [typicalDays, setTypicalDays] = useState(gymPreferences.typicalDays || []);
  const [typicalTimes, setTypicalTimes] = useState(gymPreferences.typicalTimes || []);

  const handleSave = () => {
    onSave({
      cityArea,
      preferredGyms: toArray(gymsText),
      typicalDays,
      typicalTimes,
    });
  };

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
            value={cityArea}
            onChange={(e) => setCityArea(e.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Preferred gym(s)</span>
          <input
            type="text"
            placeholder="e.g. PureGym Bristol, Anytime Fitness"
            value={gymsText}
            onChange={(e) => setGymsText(e.target.value)}
          />
        </label>

        <div className="form-field">
          <span>Typical training days</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginTop: 4 }}>
            {DAYS.map((day) => (
              <FilterChip
                key={day}
                label={day}
                active={typicalDays.includes(day)}
                onClick={() => setTypicalDays((prev) => toggleValue(prev, day))}
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
                active={typicalTimes.includes(time)}
                onClick={() => setTypicalTimes((prev) => toggleValue(prev, time))}
              />
            ))}
          </div>
        </div>

        <Button variant="primary" onClick={handleSave}>Save</Button>
      </div>
    </Card>
  );
}

export default GymPreferencesForm;
