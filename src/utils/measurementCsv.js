import { MEASUREMENT_FIELDS, getMeasurementValue, getMeasurementUnit } from './measurementFields';
import { toCsv, parseCsv } from './csv';

// CSV values are always canonical metric (same as Firestore storage),
// regardless of the user's display-unit preference — this keeps import
// and export unambiguous and guarantees an exact round-trip, rather than
// risking a conversion mismatch between export time and import time.
function buildColumns() {
  return [
    { key: 'date', label: 'Date', get: (m) => m.date },
    ...MEASUREMENT_FIELDS.map((field) => ({
      key: field.key,
      label: `${field.label} (${getMeasurementUnit(field, 'metric') || 'unitless'})`,
      get: (m) => getMeasurementValue(m, field),
    })),
    { key: 'notes', label: 'Notes', get: (m) => m.notes },
  ];
}

export function exportMeasurementsToCsv(measurements) {
  return toCsv(measurements, buildColumns());
}

// Inverse of export — given parsed CSV rows (from parseCsv), returns an
// array of measurement objects ready for addMeasurement(). Rows missing a
// valid date are skipped; unrecognized/empty columns are simply ignored.
export function parseMeasurementsCsv(csvText) {
  const rows = parseCsv(csvText);
  const columns = buildColumns();

  return rows
    .map((row) => {
      const date = row['Date'];
      if (!date || Number.isNaN(new Date(date).getTime())) return null;

      const entry = { date, notes: row['Notes'] || '' };
      const measurementsMap = {};

      MEASUREMENT_FIELDS.forEach((field) => {
        const column = columns.find((c) => c.key === field.key);
        const raw = row[column.label];
        if (raw === undefined || raw === '') return;

        const value = Number(raw);
        if (Number.isNaN(value)) return;

        if (field.path.startsWith('measurements.')) {
          measurementsMap[field.path.split('.')[1]] = value;
        } else {
          entry[field.key] = value;
        }
      });

      if (Object.keys(measurementsMap).length > 0) entry.measurements = measurementsMap;
      return entry;
    })
    .filter(Boolean);
}
