import { toArray } from './textFormatting';

// Exercise metadata (bodySection, equipmentCategory, difficulty) is
// manually typed into Firestore, so casing/whitespace can vary. Normalize
// everything the same way so filters actually match regardless of how a
// value was typed in — same lesson learned from the difficulty filter bug.
function normalize(value) {
  if (!value) return null;
  return String(value).trim().toLowerCase();
}

export const BODY_SECTIONS = ['Upper Body', 'Lower Body', 'Other'];

export function getEquipmentCategories(exercises) {
  const values = new Set();
  exercises.forEach((ex) => {
    if (ex.equipmentCategory) values.add(ex.equipmentCategory.trim());
  });
  return [...values].sort();
}

// Groups the unique `muscleGroup` values under each `bodySection`, for the
// Muscle Group filter's grouped menu. `bodySection` is only used here to
// organize the UI — the actual filter still applies on `muscleGroup`.
// Any exercise with an unrecognized/missing bodySection is bucketed under
// "Other" rather than dropped, so nothing silently disappears from the menu.
export function getMuscleGroupsBySection(exercises) {
  const buckets = { 'Upper Body': new Set(), 'Lower Body': new Set(), Other: new Set() };

  exercises.forEach((ex) => {
    if (!ex.muscleGroup) return;
    const section = normalize(ex.bodySection);
    const bucketKey = BODY_SECTIONS.find((s) => normalize(s) === section) || 'Other';
    buckets[bucketKey].add(ex.muscleGroup.trim());
  });

  return {
    'Upper Body': [...buckets['Upper Body']].sort(),
    'Lower Body': [...buckets['Lower Body']].sort(),
    Other: [...buckets.Other].sort(),
  };
}

// `bodySection` stays in the filter shape (unused by the current UI, which
// filters on `muscleGroup` instead) so the underlying capability isn't
// removed from the data model, per the design decision to keep it available.
export const DEFAULT_FILTERS = {
  bodySection: null,
  muscleGroup: null,
  equipmentCategory: null,
  muscleGroupMain: null,
  muscleGroupSupport: null,
  difficulty: null,
};

export function hasActiveFilters(filters) {
  return Object.values(filters).some(Boolean);
}

export function matchesFilters(exercise, search, filters) {
  const matchesSearch = exercise.name.toLowerCase().includes(search.toLowerCase());
  const matchesBodySection = !filters.bodySection || normalize(exercise.bodySection) === normalize(filters.bodySection);
  const matchesMuscleGroup = !filters.muscleGroup || normalize(exercise.muscleGroup) === normalize(filters.muscleGroup);
  const matchesEquipment = !filters.equipmentCategory || normalize(exercise.equipmentCategory) === normalize(filters.equipmentCategory);
  const matchesMain = !filters.muscleGroupMain || toArray(exercise.muscleGroupMain).includes(filters.muscleGroupMain);
  const matchesSupport = !filters.muscleGroupSupport || toArray(exercise.muscleGroupSupport).includes(filters.muscleGroupSupport);
  const matchesDifficulty = !filters.difficulty || normalize(exercise.difficulty) === filters.difficulty;

  return matchesSearch && matchesBodySection && matchesMuscleGroup && matchesEquipment && matchesMain && matchesSupport && matchesDifficulty;
}
