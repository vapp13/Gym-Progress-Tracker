import { useState } from 'react';
import Button from '../../components/Button';
import GoalMetricsFields from './GoalMetricsFields';
import ExercisePicker from '../workouts/ExercisePicker';
import { GOAL_TYPES, getGoalTypeConfig, isLegacyGoal } from '../../utils/goalTypes';
import './GoalForm.css';

const LEGACY_GOAL_TYPES = ['weight', 'strength', 'frequency', 'custom'];

const DEFAULT_NEW_GOAL = {
  type: 'lose-weight',
  metrics: {},
  customUnit: '',
  linkedExerciseId: null,
  linkedExerciseName: null,
  deadline: '',
  notes: '',
};

const DEFAULT_LEGACY_GOAL = {
  type: 'weight',
  startValue: 0,
  currentValue: 0,
  targetValue: 0,
  deadline: '',
};

function LegacyGoalFields({ goal, onChange }) {
  const handleField = (field, value) => onChange({ ...goal, [field]: value });

  return (
    <>
      <label className="form-field">
        <span>Goal type</span>
        <select value={goal.type} onChange={(e) => handleField('type', e.target.value)}>
          {LEGACY_GOAL_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>
      <label className="form-field">
        <span>Starting value</span>
        <input type="number" value={goal.startValue} onChange={(e) => handleField('startValue', Number(e.target.value))} />
      </label>
      <label className="form-field">
        <span>Current value</span>
        <input type="number" value={goal.currentValue} onChange={(e) => handleField('currentValue', Number(e.target.value))} />
      </label>
      <label className="form-field">
        <span>Target value</span>
        <input type="number" value={goal.targetValue} onChange={(e) => handleField('targetValue', Number(e.target.value))} />
      </label>
      <label className="form-field">
        <span>Deadline</span>
        <input type="date" value={goal.deadline} onChange={(e) => handleField('deadline', e.target.value)} />
      </label>
    </>
  );
}

function GoalForm({ initialGoal, onSave, onCancel }) {
  const editingLegacy = initialGoal && isLegacyGoal(initialGoal);
  const [isLegacyMode] = useState(editingLegacy);
  const [goal, setGoal] = useState(
    initialGoal
      ? { ...(editingLegacy ? DEFAULT_LEGACY_GOAL : DEFAULT_NEW_GOAL), ...initialGoal, metrics: initialGoal.metrics || {} }
      : DEFAULT_NEW_GOAL
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const typeConfig = !isLegacyMode ? getGoalTypeConfig(goal.type) : null;
  const isEditingExistingType = Boolean(initialGoal) && !isLegacyMode;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(goal);
  };

  const handleTypeChange = (type) => {
    setGoal((prev) => ({ ...prev, type, metrics: {}, linkedExerciseId: null, linkedExerciseName: null }));
  };

  return (
    <form className="goal-form" onSubmit={handleSubmit}>
      {isLegacyMode ? (
        <LegacyGoalFields goal={goal} onChange={setGoal} />
      ) : (
        <>
          <label className="form-field">
            <span>Goal type</span>
            <select
              value={goal.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              disabled={isEditingExistingType}
            >
              {GOAL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>

          {typeConfig?.requiresExercise && (
            <div className="form-field">
              <span>Exercise</span>
              <Button
                variant="secondary"
                type="button"
                onClick={() => setIsPickerOpen(true)}
                style={{ width: '100%' }}
              >
                {goal.linkedExerciseName || 'Select an exercise'}
              </Button>
            </div>
          )}

          {typeConfig && (
            <GoalMetricsFields
              typeConfig={typeConfig}
              metrics={goal.metrics}
              customUnit={goal.customUnit}
              onChange={(metrics) => setGoal((prev) => ({ ...prev, metrics }))}
              onUnitChange={(customUnit) => setGoal((prev) => ({ ...prev, customUnit }))}
            />
          )}

          {!typeConfig?.noDeadline && (
            <label className="form-field">
              <span>Target date</span>
              <input
                type="date"
                value={goal.deadline || ''}
                onChange={(e) => setGoal((prev) => ({ ...prev, deadline: e.target.value }))}
              />
            </label>
          )}

          <label className="form-field">
            <span>Notes (optional)</span>
            <input
              type="text"
              placeholder="Any context for this goal"
              value={goal.notes || ''}
              onChange={(e) => setGoal((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </label>
        </>
      )}

      <div className="goal-form-actions">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save Goal
        </Button>
      </div>

      <ExercisePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(exercise) => {
          setGoal((prev) => ({ ...prev, linkedExerciseId: exercise.id, linkedExerciseName: exercise.name }));
          setIsPickerOpen(false);
        }}
      />
    </form>
  );
}

export default GoalForm;
