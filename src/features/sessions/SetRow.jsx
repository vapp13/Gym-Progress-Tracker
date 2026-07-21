import { useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import SetTypeModal from './SetTypeModal';
import { getSetTypeConfig } from '../../utils/setTypes';
import './SetRow.css';

function SetRow({ setNumber, set, onChange, onRemove, canRemove }) {
  const [expanded, setExpanded] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  const handleField = (field, value) => {
    const updated = { ...set, [field]: value };
    if (field === 'completed') {
      updated.completedAt = value ? Date.now() : null;
    }
    onChange(updated);
  };

  const handleCompletedChange = (checked) => {
    // A completed set should have real numbers behind it — don't allow
    // checking it off while reps/weight are still empty.
    if (checked && (set.reps === '' || set.weight === '')) return;
    handleField('completed', checked);
  };

  const typeConfig = getSetTypeConfig(set.type || 'working');

  return (
    <div className={`set-row ${set.completed ? 'set-row-completed' : ''}`}>
      <div className="set-row-main">
        <span className="set-row-number">
          {typeConfig.badge ? (
            <span className="set-row-type-badge" style={{ backgroundColor: typeConfig.softColor, color: typeConfig.color }}>
              {typeConfig.badge}
            </span>
          ) : setNumber}
        </span>

        <label className="set-row-field">
          <span>Reps</span>
          <input
            type="number"
            min="0"
            placeholder="—"
            value={set.reps}
            onChange={(e) => handleField('reps', e.target.value === '' ? '' : Number(e.target.value))}
          />
        </label>

        <label className="set-row-field">
          <span>Weight</span>
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="—"
            value={set.weight}
            onChange={(e) => handleField('weight', e.target.value === '' ? '' : Number(e.target.value))}
          />
        </label>

        <label className="set-row-checkbox">
          <input
            type="checkbox"
            checked={set.completed}
            onChange={(e) => handleCompletedChange(e.target.checked)}
            aria-label={`Mark set ${setNumber} done`}
          />
        </label>

        {canRemove && (
          <button
            type="button"
            className="set-row-remove-icon"
            onClick={onRemove}
            aria-label={`Remove set ${setNumber}`}
          >
            <Trash2 size={15} />
          </button>
        )}

        <button
          type="button"
          className={`set-row-expand ${expanded ? 'is-open' : ''}`}
          onClick={() => setExpanded((prev) => !prev)}
          aria-label={expanded ? 'Hide set details' : 'Show set details (type, notes)'}
          aria-expanded={expanded}
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {expanded && (
        <div className="set-row-details">
          <div className="set-row-details-fields">
            <div className="form-field" style={{ flex: 1 }}>
              <span>Type</span>
              <button
                type="button"
                className="set-row-type-trigger"
                onClick={() => setIsTypeModalOpen(true)}
              >
                {typeConfig.color && <span className="set-type-option-dot" style={{ backgroundColor: typeConfig.color }} />}
                {typeConfig.label}
              </button>
            </div>

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
        </div>
      )}

      <SetTypeModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        value={set.type || 'working'}
        onChange={(type) => handleField('type', type)}
      />
    </div>
  );
}

export default SetRow;
