import { useState } from 'react';
import { User } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { calculateAge } from '../../utils/age';

const GENDERS = ['', 'female', 'male', 'non-binary', 'prefer not to say'];

function PersonalInfoForm({ profile, units, onSave, onUnitsChange }) {
  const [form, setForm] = useState(profile);
  const [savedUnits, setSavedUnits] = useState(units);

  const handleField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const age = calculateAge(form.dateOfBirth);

  const handleSave = () => {
    onSave(form);
    onUnitsChange(savedUnits);
  };

  return (
    <Card>
      <div className="card-icon-row">
        <span className="card-icon card-icon-primary"><User size={18} /></span>
        <span className="card-eyebrow">Personal Information</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
        <label className="form-field">
          <span>Date of birth {age !== null && `(age ${age})`}</span>
          <input
            type="date"
            value={form.dateOfBirth || ''}
            onChange={(e) => handleField('dateOfBirth', e.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Height (cm)</span>
          <input
            type="number"
            min="0"
            value={form.height || ''}
            onChange={(e) => handleField('height', Number(e.target.value))}
          />
        </label>

        <label className="form-field">
          <span>Gender (optional)</span>
          <select value={form.gender || ''} onChange={(e) => handleField('gender', e.target.value)}>
            {GENDERS.map((g) => (
              <option key={g} value={g}>{g || 'Prefer not to say'}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Units</span>
          <select value={savedUnits} onChange={(e) => setSavedUnits(e.target.value)}>
            <option value="metric">Metric (kg / cm)</option>
            <option value="imperial">Imperial (lb / ft-in)</option>
          </select>
        </label>

        <Button variant="primary" onClick={handleSave}>Save</Button>
      </div>
    </Card>
  );
}

export default PersonalInfoForm;
