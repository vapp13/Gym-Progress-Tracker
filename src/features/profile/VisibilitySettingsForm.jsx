import { ShieldCheck } from 'lucide-react';
import Card from '../../components/Card';
import './VisibilitySettingsForm.css';

const TOGGLABLE_FIELDS = [
  { key: 'goals', label: 'Goals' },
  { key: 'trainingActivity', label: 'Training Activity' },
  { key: 'progressSummaries', label: 'Progress Summaries' },
];

function VisibilitySettingsForm({ value, onChange }) {
  const toggleField = (key) => {
    onChange({
      ...value,
      [key]: value[key] === 'friends' ? 'private' : 'friends',
    });
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
              className={`visibility-toggle ${value[key] === 'friends' ? 'is-friends' : 'is-private'}`}
              onClick={() => toggleField(key)}
              aria-pressed={value[key] === 'friends'}
            >
              {value[key] === 'friends' ? 'Friends Only' : 'Private'}
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default VisibilitySettingsForm;
