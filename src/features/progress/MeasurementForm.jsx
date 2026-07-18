import { useState } from 'react';
import Button from '../../components/Button';
import '../goals/GoalForm.css';

function MeasurementForm({ onSave, onCancel }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ date, weight: Number(weight) });
  };

  return (
    <form className="goal-form" onSubmit={handleSubmit}>
      <label className="form-field">
        <span>Date</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <label className="form-field">
        <span>Weight (kg)</span>
        <input
          type="number"
          step="0.1"
          min="0"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </label>

      <div className="goal-form-actions">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save
        </Button>
      </div>
    </form>
  );
}

export default MeasurementForm;