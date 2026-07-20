import { Edit2, Trash2 } from 'lucide-react';
import { getMeasurementValue, getMeasurementUnit, convertToDisplayUnits } from '../../utils/measurementFields';
import EmptyState from '../../components/EmptyState';
import './MeasurementHistoryList.css';

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function MeasurementHistoryList({ measurements, field, units, onEdit, onDelete }) {
  const entries = measurements.filter((entry) => getMeasurementValue(entry, field) !== null);

  if (entries.length === 0) {
    return <EmptyState message={`No ${field.label.toLowerCase()} entries logged yet.`} />;
  }

  const unit = getMeasurementUnit(field, units);

  return (
    <div>
      {entries.map((entry) => {
        const value = convertToDisplayUnits(getMeasurementValue(entry, field), field.unitType, units);
        return (
          <div key={entry.id} className="measurement-history-row">
            <div className="measurement-history-main">
              <span className="measurement-history-value">{value}{unit && ` ${unit}`}</span>
              <span className="measurement-history-date">{formatDate(entry.date)} · {field.label}</span>
            </div>
            <div className="measurement-history-actions">
              <button
                className="measurement-history-action-btn"
                onClick={() => onEdit(entry)}
                aria-label={`Edit ${field.label} entry from ${formatDate(entry.date)}`}
                title="Edit"
              >
                <Edit2 size={15} />
              </button>
              <button
                className="measurement-history-action-btn measurement-history-action-delete"
                onClick={() => onDelete(entry)}
                aria-label={`Delete ${field.label} entry from ${formatDate(entry.date)}`}
                title="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MeasurementHistoryList;
