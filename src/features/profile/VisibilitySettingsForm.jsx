import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import './VisibilitySettingsForm.css';

const TOGGLABLE_FIELDS = [
  { key: 'goals', label: 'Goals' },
  { key: 'trainingActivity', label: 'Training Activity' },
  { key: 'progressSummaries', label: 'Progress Summaries' },
];

function VisibilitySettingsForm({ visibility, onSave }) {
  const [form, setForm] = useState(visibility);

  const toggleField = (key) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key] === 'friends' ? 'private' : 'friends',
    }));
  };

  return (
    <Card>
      <div className="card-icon-row">
        <span className="card-icon card-icon-success"><ShieldCheck size={18} /></span>
        <span className="card-eyebrow">Privacy</span>
      </div>

      <div style={{ marginTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', margin: 0 }}>
          Always public: username, profile picture, workout streak.<br />
          Always private: weight, body measurements, exact location.
        </p>

        {TOGGLABLE_FIELDS.map(({ key, label }) => (
          <div key={key} className="visibility-row">
            <span>{label}</span>
            <button
              type="button"
              className={`visibility-toggle ${form[key] === 'friends' ? 'is-friends' : 'is-private'}`}
              onClick={() => toggleField(key)}
              aria-pressed={form[key] === 'friends'}
            >
              {form[key] === 'friends' ? 'Friends Only' : 'Private'}
            </button>
          </div>
        ))}

        <Button variant="primary" onClick={() => onSave(form)} style={{ marginTop: 'var(--space-sm)' }}>
          Save
        </Button>
      </div>
    </Card>
  );
}

export default VisibilitySettingsForm;
