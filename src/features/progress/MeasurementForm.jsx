import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Button from '../../components/Button';
import Tooltip from '../../components/Tooltip';
import { MEASUREMENT_FIELDS, getFieldsBySection, getMeasurementUnit, convertToCanonicalUnits } from '../../utils/measurementFields';
import { calculateAge } from '../../utils/age';
import { calculateBMI, calculateBMR, getBMICategory } from '../../utils/bodyMetrics';
import './MeasurementForm.css';

const WEIGHT_FIELD = MEASUREMENT_FIELDS.find((f) => f.key === 'weight');
const COMPOSITION_FIELDS = getFieldsBySection('composition');
const MEASUREMENT_SECTION_FIELDS = getFieldsBySection('measurement');

function CalculatedRow({ label, value, unit, sublabel }) {
  return (
    <div className="measurement-form-calculated-row">
      <span>{label}</span>
      <span className="measurement-form-calculated-value">
        {value !== null ? `${value}${unit ? ` ${unit}` : ''}` : '—'}
        {sublabel && value !== null && <span className="measurement-form-calculated-sublabel"> · {sublabel}</span>}
      </span>
    </div>
  );
}

function MeasurementForm({ onSave, onCancel, units = 'metric', profile }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [values, setValues] = useState({});
  const [openSection, setOpenSection] = useState(null);

  const handleFieldChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const canonicalWeight = convertToCanonicalUnits(weight, 'weight', units);
  const age = calculateAge(profile?.profile?.dateOfBirth);
  const height = profile?.profile?.height || null;
  const gender = profile?.profile?.gender;
  const hasProfileData = Boolean(age && height && canonicalWeight);

  const bmi = hasProfileData ? calculateBMI(canonicalWeight, height) : null;
  const bmr = hasProfileData ? calculateBMR(canonicalWeight, height, age, gender) : null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const measurementsMap = {};
    const topLevelValues = {};

    [...COMPOSITION_FIELDS, ...MEASUREMENT_SECTION_FIELDS].forEach((field) => {
      const raw = values[field.key];
      if (raw === undefined || raw === '') return;
      const canonical = convertToCanonicalUnits(raw, field.unitType, units);

      if (field.path.startsWith('measurements.')) {
        measurementsMap[field.path.split('.')[1]] = canonical;
      } else {
        topLevelValues[field.key] = canonical;
      }
    });

    onSave({
      date,
      weight: canonicalWeight,
      notes,
      ...topLevelValues,
      ...(Object.keys(measurementsMap).length > 0 && { measurements: measurementsMap }),
    });
  };

  return (
    <form className="goal-form" onSubmit={handleSubmit}>
      <div className="measurement-form-row">
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
      </div>

      <label className="form-field">
        <span>Notes (optional)</span>
        <input
          type="text"
          placeholder="Anything worth remembering about this entry"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>

      <div className="measurement-form-section">
        <button
          type="button"
          className="measurement-form-expand"
          onClick={() => setOpenSection((prev) => (prev === 'composition' ? null : 'composition'))}
        >
          Body Composition Metrics
          <ChevronDown size={14} className={openSection === 'composition' ? 'is-open' : ''} />
        </button>

        {openSection === 'composition' && (
          <div className="measurement-form-section-body">
            <p className="measurement-form-section-hint">
              These are usually obtained from a smart scale, body composition scanner, or specialist equipment.
            </p>

            <div className="measurement-form-calculated">
              <CalculatedRow label="BMI" value={bmi} sublabel={bmi ? getBMICategory(bmi) : null} />
              <CalculatedRow label="BMR" value={bmr} unit="kcal/day" />
              {!hasProfileData && (
                <p className="measurement-form-calculated-note">
                  Add your date of birth and height in Settings, and enter your weight above, to see these automatically.
                </p>
              )}
            </div>

            <div className="measurement-form-grid">
              {COMPOSITION_FIELDS.map((field) => (
                <div className="form-field" key={field.key}>
                  <span>
                    {field.label} {getMeasurementUnit(field, units) && `(${getMeasurementUnit(field, units)})`}
                    <Tooltip text={field.help} />
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={values[field.key] ?? ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="measurement-form-section">
        <button
          type="button"
          className="measurement-form-expand"
          onClick={() => setOpenSection((prev) => (prev === 'measurement' ? null : 'measurement'))}
        >
          Body Measurements
          <ChevronDown size={14} className={openSection === 'measurement' ? 'is-open' : ''} />
        </button>

        {openSection === 'measurement' && (
          <div className="measurement-form-section-body">
            <div className="measurement-form-grid">
              {MEASUREMENT_SECTION_FIELDS.map((field) => (
                <div className="form-field" key={field.key}>
                  <span>
                    {field.label} ({getMeasurementUnit(field, units)})
                    <Tooltip text={field.help} />
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={values[field.key] ?? ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
