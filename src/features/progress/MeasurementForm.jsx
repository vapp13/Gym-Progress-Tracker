import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Button from '../../components/Button';
import '../goals/GoalForm.css';

function MeasurementForm({ onSave, onCancel }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [bodyFatPercent, setBodyFatPercent] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [chest, setChest] = useState('');
  const [arms, setArms] = useState('');
  const [legs, setLegs] = useState('');
  const [showMore, setShowMore] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const measurements = { waist, hip, chest, arms, legs };
    const hasMeasurements = Object.values(measurements).some((v) => v !== '');

    onSave({
      date,
      weight: Number(weight),
      ...(bodyFatPercent !== '' && { bodyFatPercent: Number(bodyFatPercent) }),
      ...(hasMeasurements && {
        measurements: Object.fromEntries(
          Object.entries(measurements)
            .filter(([, v]) => v !== '')
            .map(([k, v]) => [k, Number(v)])
        ),
      }),
    });
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

      <button
        type="button"
        className="measurement-form-expand"
        onClick={() => setShowMore((prev) => !prev)}
      >
        More measurements (optional)
        <ChevronDown size={14} className={showMore ? 'is-open' : ''} />
      </button>

      {showMore && (
        <div className="measurement-form-extra">
          <label className="form-field">
            <span>Body Fat %</span>
            <input type="number" step="0.1" min="0" value={bodyFatPercent} onChange={(e) => setBodyFatPercent(e.target.value)} />
          </label>
          <div className="measurement-form-grid">
            <label className="form-field">
              <span>Waist (cm)</span>
              <input type="number" step="0.1" min="0" value={waist} onChange={(e) => setWaist(e.target.value)} />
            </label>
            <label className="form-field">
              <span>Hip (cm)</span>
              <input type="number" step="0.1" min="0" value={hip} onChange={(e) => setHip(e.target.value)} />
            </label>
            <label className="form-field">
              <span>Chest (cm)</span>
              <input type="number" step="0.1" min="0" value={chest} onChange={(e) => setChest(e.target.value)} />
            </label>
            <label className="form-field">
              <span>Arms (cm)</span>
              <input type="number" step="0.1" min="0" value={arms} onChange={(e) => setArms(e.target.value)} />
            </label>
            <label className="form-field">
              <span>Legs (cm)</span>
              <input type="number" step="0.1" min="0" value={legs} onChange={(e) => setLegs(e.target.value)} />
            </label>
          </div>
        </div>
      )}

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
