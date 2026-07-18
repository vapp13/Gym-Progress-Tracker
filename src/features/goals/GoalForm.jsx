import { useState } from 'react';
import Button from '../../components/Button';
import './GoalForm.css';

const GOAL_TYPES = ['weight', 'strength', 'frequency', 'custom'];

const DEFAULT_GOAL = {
  type: 'weight',
  startValue: 0,
  currentValue: 0,
  targetValue: 0,
  deadline: '',
};

function GoalForm({ initialGoal, onSave, onCancel }) {
  const [goal, setGoal] = useState(initialGoal || DEFAULT_GOAL);

  const handleField = (field, value) => {
    setGoal((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(goal);
  };

  return (
    <form className="goal-form" onSubmit={handleSubmit}>
      <label className="form-field">
        <span>Goal type</span>
        <select value={goal.type} onChange={(e) => handleField('type', e.target.value)}>
          {GOAL_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>

      <label className="form-field">
        <span>Starting value</span>
        <input
          type="number"
          value={goal.startValue}
          onChange={(e) => handleField('startValue', Number(e.target.value))}
        />
      </label>

      <label className="form-field">
        <span>Current value</span>
        <input
          type="number"
          value={goal.currentValue}
          onChange={(e) => handleField('currentValue', Number(e.target.value))}
        />
      </label>

      <label className="form-field">
        <span>Target value</span>
        <input
          type="number"
          value={goal.targetValue}
          onChange={(e) => handleField('targetValue', Number(e.target.value))}
        />
      </label>

      <label className="form-field">
        <span>Deadline</span>
        <input
          type="date"
          value={goal.deadline}
          onChange={(e) => handleField('deadline', e.target.value)}
        />
      </label>

      <div className="goal-form-actions">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save Goal
        </Button>
      </div>
    </form>
  );
}

export default GoalForm;