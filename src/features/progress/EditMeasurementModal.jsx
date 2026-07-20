import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { getMeasurementValue, getMeasurementUnit, convertToDisplayUnits, convertToCanonicalUnits } from '../../utils/measurementFields';

function EditMeasurementModal({ isOpen, onClose, entry, field, units, onSave }) {
  const [date, setDate] = useState('');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (entry && field) {
      const canonical = getMeasurementValue(entry, field);
      setDate(entry.date || '');
      setValue(canonical !== null ? convertToDisplayUnits(canonical, field.unitType, units) : '');
      setNotes(entry.notes || '');
    }
  }, [entry, field, units]);

  if (!entry || !field) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(entry.id, {
      date,
      notes,
      [field.path]: convertToCanonicalUnits(value, field.unitType, units),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${field.label}`}>
      <form className="goal-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>

        <label className="form-field">
          <span>{field.label} ({getMeasurementUnit(field, units)})</span>
          <input
            type="number"
            step="0.1"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </label>

        <label className="form-field">
          <span>Notes (optional)</span>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>

        <div className="goal-form-actions">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default EditMeasurementModal;
