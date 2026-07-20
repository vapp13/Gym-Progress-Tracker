import { useState } from 'react';
import { Zap } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const GOALS = [
  { value: 'lose-weight', label: 'Lose Weight' },
  { value: 'build-muscle', label: 'Build Muscle' },
  { value: 'strength', label: 'Strength' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'maintain', label: 'Maintain' },
];

const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced'];

function FitnessInfoForm({ profile, onSave }) {
  const [form, setForm] = useState(profile);
  const handleField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Card>
      <div className="card-icon-row">
        <span className="card-icon card-icon-primary"><Zap size={18} /></span>
        <span className="card-eyebrow">Fitness Information</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
        <label className="form-field">
          <span>Main goal</span>
          <select value={form.goal} onChange={(e) => handleField('goal', e.target.value)}>
            {GOALS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Experience level</span>
          <select value={form.experienceLevel} onChange={(e) => handleField('experienceLevel', e.target.value)}>
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </label>

        <Button variant="primary" onClick={() => onSave(form)}>Save</Button>
      </div>
    </Card>
  );
}

export default FitnessInfoForm;
