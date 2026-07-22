// Single source of truth for every trackable body measurement — used by
// the selector, the entry form, and the chart, so the field list only
// ever needs to be maintained in one place.
import { kgToLb, lbToKg, cmToInches, inchesToCm } from './units';

const MEASURE_HELP_SUFFIX = ' Measure under the same conditions each time for consistent, comparable results.';

export const MEASUREMENT_FIELDS = [
  { key: 'weight', label: 'Body Weight', path: 'weight', unitType: 'weight' },

  // --- Body Composition Metrics ---
  {
    key: 'bodyFatPercent', label: 'Body Fat %', path: 'bodyFatPercent', unitType: 'percent', section: 'composition',
    help: 'The percentage of your body weight that is fat. Usually obtained from a smart/body-composition scale, skinfold calipers, or a DEXA scan at a clinic or gym.',
  },
  {
    key: 'leanBodyMass', label: 'Fat-Free Body Weight', path: 'leanBodyMass', unitType: 'weight', derivable: true, section: 'composition',
    help: 'Your total body weight minus fat mass — everything else (muscle, bone, water, organs). Most smart scales calculate this automatically alongside body fat %.',
  },
  {
    key: 'subcutaneousFat', label: 'Subcutaneous Fat', path: 'subcutaneousFat', unitType: 'percent', section: 'composition',
    help: 'The fat stored just under your skin (as opposed to around your organs). Reported by most body-composition smart scales.',
  },
  {
    key: 'visceralFat', label: 'Visceral Fat', path: 'visceralFat', unitType: 'none', section: 'composition',
    help: 'A rating of fat stored around your internal organs — usually shown as a number (e.g. 1-59) rather than a percentage. Reported by body-composition smart scales; higher values are generally associated with greater health risk.',
  },
  {
    key: 'bodyWater', label: 'Body Water', path: 'bodyWater', unitType: 'percent', section: 'composition',
    help: 'The percentage of your body weight that is water. Reported by most body-composition smart scales — can fluctuate day to day with hydration.',
  },
  {
    key: 'skeletalMuscle', label: 'Skeletal Muscle', path: 'skeletalMuscle', unitType: 'percent', section: 'composition',
    help: 'The percentage of your body weight made up of skeletal muscle (the muscle you can train). Reported by body-composition smart scales.',
  },
  {
    key: 'muscleMass', label: 'Muscle Mass', path: 'muscleMass', unitType: 'weight', section: 'composition',
    help: 'Your total muscle weight (skeletal muscle plus smooth muscle and water within it). Reported by body-composition smart scales, usually alongside skeletal muscle %.',
  },
  {
    key: 'boneMass', label: 'Bone Mass', path: 'boneMass', unitType: 'weight', section: 'composition',
    help: 'An estimate of your skeletal weight. Reported by most body-composition smart scales — changes very slowly over time.',
  },
  {
    key: 'proteinPercent', label: 'Protein %', path: 'proteinPercent', unitType: 'percent', section: 'composition',
    help: 'The percentage of your body weight made up of protein. Reported by higher-end body-composition smart scales.',
  },
  {
    key: 'metabolicAge', label: 'Metabolic Age', path: 'metabolicAge', unitType: 'none', section: 'composition',
    help: 'An estimate of how your metabolic rate compares to average for different ages, based on your BMR. Reported by most body-composition smart scales — a wellness indicator, not a medical measurement.',
  },

  // --- Body Measurements (tape measure, cm/in) ---
  {
    key: 'waist', label: 'Waist', path: 'measurements.waist', unitType: 'length', section: 'measurement',
    help: 'Measure around the narrowest point of your waist, or at belly button level.' + MEASURE_HELP_SUFFIX,
  },
  {
    key: 'neck', label: 'Neck', path: 'measurements.neck', unitType: 'length', section: 'measurement',
    help: 'Measure around the middle of your neck, just below the larynx (Adam\'s apple).' + MEASURE_HELP_SUFFIX,
  },
  {
    key: 'shoulders', label: 'Shoulders', path: 'measurements.shoulders', unitType: 'length', section: 'measurement',
    help: 'Measure around the widest point of your shoulders, across both deltoids.' + MEASURE_HELP_SUFFIX,
  },
  {
    key: 'chest', label: 'Chest', path: 'measurements.chest', unitType: 'length', section: 'measurement',
    help: 'Measure around the fullest part of your chest, with the tape level across your back.' + MEASURE_HELP_SUFFIX,
  },
  {
    key: 'leftBicep', label: 'Left Bicep', path: 'measurements.leftBicep', unitType: 'length', section: 'measurement',
    help: 'Measure around the largest part of your left upper arm, with the arm relaxed at your side.' + MEASURE_HELP_SUFFIX,
  },
  {
    key: 'rightBicep', label: 'Right Bicep', path: 'measurements.rightBicep', unitType: 'length', section: 'measurement',
    help: 'Measure around the largest part of your right upper arm, with the arm relaxed at your side.' + MEASURE_HELP_SUFFIX,
  },
  {
    key: 'leftForearm', label: 'Left Forearm', path: 'measurements.leftForearm', unitType: 'length', section: 'measurement',
    help: 'Measure around the widest part of your left forearm, just below the elbow.' + MEASURE_HELP_SUFFIX,
  },
  {
    key: 'rightForearm', label: 'Right Forearm', path: 'measurements.rightForearm', unitType: 'length', section: 'measurement',
    help: 'Measure around the widest part of your right forearm, just below the elbow.' + MEASURE_HELP_SUFFIX,
  },
  {
    key: 'abdomen', label: 'Abdomen', path: 'measurements.abdomen', unitType: 'length', section: 'measurement',
    help: 'Measure around your abdomen at the level of your belly button, standing relaxed (don\'t hold your stomach in).' + MEASURE_HELP_SUFFIX,
  },
  {
    key: 'hips', label: 'Hips', path: 'measurements.hips', unitType: 'length', section: 'measurement',
    help: 'Measure around the widest part of your hips/glutes, feet together.' + MEASURE_HELP_SUFFIX,
  },
  {
    key: 'leftThigh', label: 'Left Thigh', path: 'measurements.leftThigh', unitType: 'length', section: 'measurement',
    help: 'Measure around the widest part of your left thigh, just below the glute.' + MEASURE_HELP_SUFFIX,
  },
  {
    key: 'rightThigh', label: 'Right Thigh', path: 'measurements.rightThigh', unitType: 'length', section: 'measurement',
    help: 'Measure around the widest part of your right thigh, just below the glute.' + MEASURE_HELP_SUFFIX,
  },
  {
    key: 'leftCalf', label: 'Left Calf', path: 'measurements.leftCalf', unitType: 'length', section: 'measurement',
    help: 'Measure around the widest part of your left calf, standing with weight evenly balanced.' + MEASURE_HELP_SUFFIX,
  },
  {
    key: 'rightCalf', label: 'Right Calf', path: 'measurements.rightCalf', unitType: 'length', section: 'measurement',
    help: 'Measure around the widest part of your right calf, standing with weight evenly balanced.' + MEASURE_HELP_SUFFIX,
  },
];

export function getFieldsBySection(section) {
  return MEASUREMENT_FIELDS.filter((f) => f.section === section);
}

export function getMeasurementField(key) {
  return MEASUREMENT_FIELDS.find((f) => f.key === key) || null;
}

// Reads a (possibly nested, e.g. "measurements.waist") field from a
// measurement entry. Fat-Free Body Weight derives from weight + body fat %
// when it wasn't entered directly.
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
