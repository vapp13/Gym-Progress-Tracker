import { X } from 'lucide-react';
import './PlanExerciseRow.css';

function PlanExerciseRow({ entry, onChange, onRemove }) {
  const handleField = (field, value) => {
    onChange({ ...entry, [field]: value });
  };

  return (
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
            value={entry.targetSets}
            onChange={(e) => handleField('targetSets', Number(e.target.value))}
          />
        </label>

        <label>
          <span>Reps</span>
          <input
            type="number"
            min="1"
            value={entry.targetReps}
            onChange={(e) => handleField('targetReps', Number(e.target.value))}
          />
        </label>

        <label>
          <span>Weight (kg)</span>
          <input
            type="number"
            min="0"
            step="0.5"
            value={entry.targetWeight}
            onChange={(e) => handleField('targetWeight', Number(e.target.value))}
          />
        </label>

        <label>
          <span>Rest (sec)</span>
          <input
            type="number"
            min="0"
            step="5"
            value={entry.restSeconds}
            onChange={(e) => handleField('restSeconds', Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}

export default PlanExerciseRow;
