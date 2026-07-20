// Single source of truth for every trackable body measurement — used by
// the selector, the entry form, and the chart, so the field list only
// ever needs to be maintained in one place.
import { kgToLb, lbToKg, cmToInches, inchesToCm } from './units';

export const MEASUREMENT_FIELDS = [
  { key: 'weight', label: 'Body Weight', path: 'weight', unitType: 'weight' },
  { key: 'waist', label: 'Waist', path: 'measurements.waist', unitType: 'length' },
  { key: 'bodyFatPercent', label: 'Body Fat %', path: 'bodyFatPercent', unitType: 'percent' },
  { key: 'leanBodyMass', label: 'Lean Body Mass', path: 'leanBodyMass', unitType: 'weight', derivable: true },
  { key: 'neck', label: 'Neck', path: 'measurements.neck', unitType: 'length' },
  { key: 'shoulders', label: 'Shoulders', path: 'measurements.shoulders', unitType: 'length' },
  { key: 'chest', label: 'Chest', path: 'measurements.chest', unitType: 'length' },
  { key: 'leftBicep', label: 'Left Bicep', path: 'measurements.leftBicep', unitType: 'length' },
  { key: 'rightBicep', label: 'Right Bicep', path: 'measurements.rightBicep', unitType: 'length' },
  { key: 'leftForearm', label: 'Left Forearm', path: 'measurements.leftForearm', unitType: 'length' },
  { key: 'rightForearm', label: 'Right Forearm', path: 'measurements.rightForearm', unitType: 'length' },
  { key: 'abdomen', label: 'Abdomen', path: 'measurements.abdomen', unitType: 'length' },
  { key: 'hips', label: 'Hips', path: 'measurements.hips', unitType: 'length' },
  { key: 'leftThigh', label: 'Left Thigh', path: 'measurements.leftThigh', unitType: 'length' },
  { key: 'rightThigh', label: 'Right Thigh', path: 'measurements.rightThigh', unitType: 'length' },
  { key: 'leftCalf', label: 'Left Calf', path: 'measurements.leftCalf', unitType: 'length' },
  { key: 'rightCalf', label: 'Right Calf', path: 'measurements.rightCalf', unitType: 'length' },
];

export function getMeasurementField(key) {
  return MEASUREMENT_FIELDS.find((f) => f.key === key) || null;
}

// Reads a (possibly nested, e.g. "measurements.waist") field from a
// measurement entry. Lean Body Mass derives from weight + body fat % when
// it wasn't entered directly.
export function getMeasurementValue(entry, field) {
  if (field.key === 'leanBodyMass' && (entry.leanBodyMass === undefined || entry.leanBodyMass === null)) {
    if (entry.weight != null && entry.bodyFatPercent != null) {
      return Math.round(entry.weight * (1 - entry.bodyFatPercent / 100) * 10) / 10;
    }
    return null;
  }

  const parts = field.path.split('.');
  let value = entry;
  for (const part of parts) {
    value = value?.[part];
  }
  return value ?? null;
}

export function getMeasurementUnit(field, units) {
  if (field.unitType === 'weight') return units === 'imperial' ? 'lb' : 'kg';
  if (field.unitType === 'length') return units === 'imperial' ? 'in' : 'cm';
  if (field.unitType === 'percent') return '%';
  return '';
}

// Canonical storage is always metric — these two convert to/from the
// user's preferred display units, shared by the chart, entry form, and
// history/edit views so the conversion logic only lives in one place.
export function convertToDisplayUnits(value, unitType, units) {
  if (value === null || value === undefined) return null;
  if (units !== 'imperial') return value;
  if (unitType === 'weight') return kgToLb(value);
  if (unitType === 'length') return cmToInches(value);
  return value;
}

export function convertToCanonicalUnits(value, unitType, units) {
  if (value === '' || value === null || value === undefined) return null;
  const num = Number(value);
  if (units !== 'imperial') return num;
  if (unitType === 'weight') return lbToKg(num);
  if (unitType === 'length') return inchesToCm(num);
  return num;
}
