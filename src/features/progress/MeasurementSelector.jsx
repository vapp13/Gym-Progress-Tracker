import { MEASUREMENT_FIELDS, getMeasurementValue } from '../../utils/measurementFields';

// Only lists measurements the user has actually logged at least once
// (Body Weight always included as the sensible default), so the dropdown
// doesn't show 16 empty options on day one.
function getAvailableFields(measurements) {
  return MEASUREMENT_FIELDS.filter((field) => {
    if (field.key === 'weight') return true;
    return measurements.some((entry) => getMeasurementValue(entry, field) !== null);
  });
}

function MeasurementSelector({ value, onChange, measurements }) {
  const availableFields = getAvailableFields(measurements);

  return (
    <label className="form-field">
      <span>Measurement</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {availableFields.map((field) => (
          <option key={field.key} value={field.key}>{field.label}</option>
        ))}
      </select>
    </label>
  );
}

export default MeasurementSelector;
