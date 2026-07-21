import { X, Link2, Link2Off } from 'lucide-react';
import './PlanExerciseRow.css';

const SECOND_OPTIONS = [0, 10, 20, 30, 40, 50];

function toMinSec(totalSeconds) {
  const seconds = Number(totalSeconds) || 0;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  // Round to the nearest 10s so older/imported data with an odd value
  // (e.g. 65s) still lands on a valid option in the seconds dropdown.
  const roundedSeconds = Math.min(50, Math.round(remainder / 10) * 10);
  return { minutes, seconds: roundedSeconds };
}

function PlanExerciseRow({ entry, isLinkedToPrevious, canLinkToPrevious, onChange, onRemove, onToggleSuperset }) {
  const handleField = (field, value) => {
    onChange({ ...entry, [field]: value });
  };

  // Sets/Reps/Weight can be legitimately 0 (e.g. bodyweight exercises), so
  // only the empty string counts as "unset" — that's what save-validation
  // checks for, not falsy values.
  const handleNumberField = (field, rawValue) => {
    handleField(field, rawValue === '' ? '' : Number(rawValue));
  };

  const { minutes, seconds } = toMinSec(entry.restSeconds);

  const handleMinutesChange = (newMinutes) => {
    handleField('restSeconds', Math.max(0, Number(newMinutes) || 0) * 60 + seconds);
  };

  const handleSecondsChange = (newSeconds) => {
    handleField('restSeconds', minutes * 60 + Number(newSeconds));
  };

  return (
    <div className={`plan-exercise-row-wrapper ${isLinkedToPrevious ? 'is-superset' : ''}`}>
      {canLinkToPrevious && (
        <button type="button" className="superset-toggle" onClick={onToggleSuperset}>
          {isLinkedToPrevious ? <Link2Off size={13} /> : <Link2 size={13} />}
          {isLinkedToPrevious ? 'Unlink superset' : 'Link as superset'}
        </button>
      )}

      <div className="plan-exercise-row">
        <div className="plan-exercise-row-header">
          <h4>{entry.exerciseName}</h4>
          <button
            className="plan-exercise-row-remove"
            onClick={onRemove}
            aria-label={`Remove ${entry.exerciseName}`}
          >
            <X size={16} />
          </button>
        </div>

        <div className="plan-exercise-row-fields">
          <label>
            <span>Sets</span>
            <input
              type="number"
              min="1"
              placeholder="—"
              value={entry.targetSets}
              onChange={(e) => handleNumberField('targetSets', e.target.value)}
            />
          </label>

          <label>
            <span>Reps</span>
            <input
              type="number"
              min="1"
              placeholder="—"
              value={entry.targetReps}
              onChange={(e) => handleNumberField('targetReps', e.target.value)}
            />
          </label>

          <label>
            <span>Weight (kg)</span>
            <input
              type="number"
              min="0"
              step="0.5"
              placeholder="—"
              value={entry.targetWeight}
              onChange={(e) => handleNumberField('targetWeight', e.target.value)}
            />
          </label>

          <label>
            <span>Rest</span>
            <div className="plan-exercise-row-rest">
              <input
                type="number"
                min="0"
                aria-label="Rest minutes"
                value={minutes}
                onChange={(e) => handleMinutesChange(e.target.value)}
              />
              <span className="plan-exercise-row-rest-unit">min</span>
              <select
                aria-label="Rest seconds"
                value={seconds}
                onChange={(e) => handleSecondsChange(e.target.value)}
              >
                {SECOND_OPTIONS.map((s) => (
                  <option key={s} value={s}>{String(s).padStart(2, '0')}</option>
                ))}
              </select>
              <span className="plan-exercise-row-rest-unit">sec</span>
            </div>
          </label>
        </div>

        <label className="plan-exercise-row-notes">
          <span>Notes</span>
          <input
            type="text"
            placeholder="e.g. focus on slow eccentric"
            value={entry.notes || ''}
            onChange={(e) => handleField('notes', e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}

export default PlanExerciseRow;
