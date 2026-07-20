import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Button from '../../components/Button';
import { MEASUREMENT_FIELDS, getMeasurementUnit, convertToCanonicalUnits } from '../../utils/measurementFields';
import '../goals/GoalForm.css';

const WEIGHT_FIELD = MEASUREMENT_FIELDS.find((f) => f.key === 'weight');
const OTHER_FIELDS = MEASUREMENT_FIELDS.filter((f) => f.key !== 'weight');

function MeasurementForm({ onSave, onCancel, units = 'metric' }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [values, setValues] = useState({});
  const [showMore, setShowMore] = useState(false);

  const handleFieldChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const measurementsMap = {};
    let bodyFatPercent;
    let leanBodyMass;

    OTHER_FIELDS.forEach((field) => {
      const raw = values[field.key];
      if (raw === undefined || raw === '') return;
      const canonical = convertToCanonicalUnits(raw, field.unitType, units);

      if (field.key === 'bodyFatPercent') {
        bodyFatPercent = canonical;
      } else if (field.key === 'leanBodyMass') {
        leanBodyMass = canonical;
      } else {
        const key = field.path.split('.')[1];
        measurementsMap[key] = canonical;
      }
    });

    onSave({
      date,
      weight: convertToCanonicalUnits(weight, 'weight', units),
      notes,
      ...(bodyFatPercent !== undefined && { bodyFatPercent }),
      ...(leanBodyMass !== undefined && { leanBodyMass }),
      ...(Object.keys(measurementsMap).length > 0 && { measurements: measurementsMap }),
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
        <span>{WEIGHT_FIELD.label} ({getMeasurementUnit(WEIGHT_FIELD, units)})</span>
        <input
          type="number"
          step="0.1"
          min="0"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </label>

      <label className="form-field">
        <span>Notes (optional)</span>
        <input
          type="text"
          placeholder="Anything worth remembering about this entry"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>

      <button
        type="button"
        className="measurement-form-expand"
        onClick={() => setShowMore((prev) => !prev)}
      >
        More measurements (optional) — log one, several, or all
        <ChevronDown size={14} className={showMore ? 'is-open' : ''} />
      </button>

      {showMore && (
        <div className="measurement-form-grid">
          {OTHER_FIELDS.map((field) => (
            <label className="form-field" key={field.key}>
              <span>{field.label} ({getMeasurementUnit(field, units)})</span>
              <input
                type="number"
                step="0.1"
                min="0"
                value={values[field.key] ?? ''}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
              />
            </label>
          ))}
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
