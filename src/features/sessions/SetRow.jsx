import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './SetRow.css';

const SET_TYPES = [
  { value: 'working', label: 'Working' },
  { value: 'warmup', label: 'Warmup' },
  { value: 'drop', label: 'Drop Set' },
  { value: 'failure', label: 'Failure' },
  { value: 'assisted', label: 'Assisted' },
];

const TYPE_BADGE = {
  working: null,
  warmup: 'W',
  drop: 'D',
  failure: 'F',
  assisted: 'A',
};

function SetRow({ setNumber, set, onChange }) {
  const [expanded, setExpanded] = useState(false);

  const handleField = (field, value) => {
    const updated = { ...set, [field]: value };
    if (field === 'completed') {
      updated.completedAt = value ? Date.now() : null;
    }
    onChange(updated);
  };

  const badge = TYPE_BADGE[set.type || 'working'];

  return (
    <div className={`set-row ${set.completed ? 'set-row-completed' : ''}`}>
      <div className="set-row-main">
        <span className="set-row-number">
          {badge ? <span className="set-row-type-badge">{badge}</span> : setNumber}
        </span>

        <label className="set-row-field">
          <span>Reps</span>
          <input
            type="number"
            min="0"
            value={set.reps}
            onChange={(e) => handleField('reps', Number(e.target.value))}
          />
        </label>

        <label className="set-row-field">
          <span>Weight</span>
          <input
            type="number"
            min="0"
            step="0.5"
            value={set.weight}
            onChange={(e) => handleField('weight', Number(e.target.value))}
          />
        </label>

        <label className="set-row-checkbox">
          <input
            type="checkbox"
            checked={set.completed}
            onChange={(e) => handleField('completed', e.target.checked)}
            aria-label={`Mark set ${setNumber} done`}
          />
        </label>

        <button
          type="button"
          className={`set-row-expand ${expanded ? 'is-open' : ''}`}
          onClick={() => setExpanded((prev) => !prev)}
          aria-label={expanded ? 'Hide set details' : 'Show set details (type, RPE, notes)'}
          aria-expanded={expanded}
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {expanded && (
        <div className="set-row-details">
          <label className="set-row-field">
            <span>Type</span>
            <select
              value={set.type || 'working'}
              onChange={(e) => handleField('type', e.target.value)}
            >
              {SET_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>

          <label className="set-row-field">
            <span>RPE</span>
            <input
              type="number"
              min="1"
              max="10"
              step="0.5"
              placeholder="—"
              value={set.rpe ?? ''}
              onChange={(e) => handleField('rpe', e.target.value === '' ? null : Number(e.target.value))}
            />
          </label>

          <label className="set-row-field set-row-notes">
            <span>Notes</span>
            <input
              type="text"
              placeholder="Optional"
              value={set.notes || ''}
              onChange={(e) => handleField('notes', e.target.value)}
            />
          </label>
        </div>
      )}
    </div>
  );
}

export default SetRow;
