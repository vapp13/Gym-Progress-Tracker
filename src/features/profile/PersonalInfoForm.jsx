import { User } from 'lucide-react';
import Card from '../../components/Card';
import { calculateAge } from '../../utils/age';
import { toTitleCase } from '../../utils/textFormatting';

const GENDERS = ['', 'female', 'male', 'non-binary', 'prefer not to say'];

function PersonalInfoForm({ value, units, onChange, onUnitsChange }) {
  const handleField = (field, val) => onChange({ ...value, [field]: val });
  const age = calculateAge(value.dateOfBirth);

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
            value={value.dateOfBirth || ''}
            onChange={(e) => handleField('dateOfBirth', e.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Height (cm)</span>
          <input
            type="number"
            min="0"
            value={value.height || ''}
            onChange={(e) => handleField('height', Number(e.target.value))}
          />
        </label>

        <label className="form-field">
          <span>Gender (optional)</span>
          <select value={value.gender || ''} onChange={(e) => handleField('gender', e.target.value)}>
            {GENDERS.map((g) => (
              <option key={g} value={g}>{toTitleCase(g) || 'Prefer Not to Say'}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Units</span>
          <select value={units} onChange={(e) => onUnitsChange(e.target.value)}>
            <option value="metric">Metric (kg / cm)</option>
            <option value="imperial">Imperial (lb / ft-in)</option>
          </select>
        </label>
      </div>
    </Card>
  );
}

export default PersonalInfoForm;
