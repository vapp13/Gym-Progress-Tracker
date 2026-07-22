import Modal from '../../components/Modal';
import { MEASUREMENT_FIELDS, getFieldsBySection, getMeasurementValue } from '../../utils/measurementFields';
import '../exercises/BodySectionFilterModal.css';

const WEIGHT_FIELD = MEASUREMENT_FIELDS.find((f) => f.key === 'weight');

// Only lists measurements the user has actually logged at least once, so
// the modal doesn't show every possible field on day one.
function getRecordedFields(fields, measurements) {
  return fields
    .filter((field) => measurements.some((entry) => getMeasurementValue(entry, field) !== null))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function MeasurementSelectorModal({ isOpen, onClose, value, onChange, measurements }) {
  const compositionFields = getRecordedFields(getFieldsBySection('composition'), measurements);
  const measurementFields = getRecordedFields(getFieldsBySection('measurement'), measurements);

  const handleSelect = (key) => {
    onChange(key);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Measurement">
      <div className="muscle-group-sections">
        <div className="muscle-group-section">
          <div className="body-section-list">
            <button
              className={`body-section-option ${value === 'weight' ? 'is-selected' : ''}`}
              onClick={() => handleSelect('weight')}
            >
              {WEIGHT_FIELD.label}
            </button>
          </div>
        </div>

        {compositionFields.length > 0 && (
          <div className="muscle-group-section">
            <h4 className="muscle-group-section-title">Body Composition Metrics</h4>
            <div className="body-section-list">
              {compositionFields.map((field) => (
                <button
                  key={field.key}
                  className={`body-section-option ${value === field.key ? 'is-selected' : ''}`}
                  onClick={() => handleSelect(field.key)}
                >
                  {field.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {measurementFields.length > 0 && (
          <div className="muscle-group-section">
            <h4 className="muscle-group-section-title">Body Measurements</h4>
            <div className="body-section-list">
              {measurementFields.map((field) => (
                <button
                  key={field.key}
                  className={`body-section-option ${value === field.key ? 'is-selected' : ''}`}
                  onClick={() => handleSelect(field.key)}
                >
                  {field.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default MeasurementSelectorModal;
