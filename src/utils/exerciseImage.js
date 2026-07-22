// Image variants shown per exercise, in carousel order. Adding a new
// variant later (e.g. a movement .gif) is a one-line addition here — no
// Firestore schema change needed, since the exercise doc only stores the
// stable `imageId` prefix, not a list of specific files.
export const EXERCISE_IMAGE_VARIANTS = [
  { suffix: 'movement_breakdown', ext: 'png', label: 'Movement' },
  { suffix: 'muscles_worked', ext: 'png', label: 'Muscles Worked' },
];

// Uses the exercise's own `imageId` field (set once per exercise, chosen
// by whoever adds its images) rather than deriving a slug from the
// display name — this keeps images stable even if the exercise is later
// renamed, which a name-derived slug would have silently broken.
//
// Each variant returns BOTH a lowercase and uppercase extension candidate
// (e.g. .png and .PNG) — file managers/OSes are inconsistent about this,
// and GitHub Pages serves from a case-sensitive filesystem where a single
// mismatched case would silently 404 in production even if it happened
// to work locally. The first candidate that actually loads wins.
export function getExerciseImageGroups(imageId) {
  if (!imageId) return [];
  const base = import.meta.env.BASE_URL;
  return EXERCISE_IMAGE_VARIANTS.map((variant) => ({
    label: variant.label,
    urls: [
      `${base}exercise-images/${imageId}_${variant.suffix}.${variant.ext.toLowerCase()}`,
      `${base}exercise-images/${imageId}_${variant.suffix}.${variant.ext.toUpperCase()}`,
    ],
  }));
}
