// Height/weight are always stored canonically in metric (cm / kg).
// These helpers only affect display, never what gets written to Firestore.

export function cmToFeetInches(cm) {
  if (!cm) return null;
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

export function feetInchesToCm(feet, inches) {
  const totalInches = Number(feet || 0) * 12 + Number(inches || 0);
  return Math.round(totalInches * 2.54);
}

export function kgToLb(kg) {
  if (kg === null || kg === undefined) return null;
  return Math.round(kg * 2.20462 * 10) / 10;
}

export function lbToKg(lb) {
  if (lb === null || lb === undefined) return null;
  return Math.round((lb / 2.20462) * 10) / 10;
}

export function formatHeight(cm, unit) {
  if (!cm) return '—';
  return unit === 'imperial' ? cmToFeetInches(cm) : `${cm} cm`;
}

export function formatWeight(kg, unit) {
  if (kg === null || kg === undefined) return '—';
  return unit === 'imperial' ? `${kgToLb(kg)} lb` : `${kg} kg`;
}

// Plain linear cm<->inches conversion for circumference measurements
// (waist, chest, biceps, etc.) — distinct from cmToFeetInches, which is
// only for the height field's feet'inches" display format.
export function cmToInches(cm) {
  if (cm === null || cm === undefined) return null;
  return Math.round((cm / 2.54) * 10) / 10;
}

export function inchesToCm(inches) {
  if (inches === null || inches === undefined) return null;
  return Math.round(inches * 2.54 * 10) / 10;
}
