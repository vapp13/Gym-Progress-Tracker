// Matches a template's exercise name against the real exercise library.
// Deliberately NOT distance-based fuzzy matching — "Leg Press" and "Leg
// Curl" are one word apart but are different exercises, and a distance
// score could easily conflate them. Containment-based matching (after
// normalizing away punctuation/equipment suffixes) tolerates naming
// variance without risking a wrong match.

function normalizeExerciseName(name) {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')       // strip "(Barbell)"-style suffixes
    .replace(/[-–—]/g, ' ')         // hyphens/dashes to spaces
    .replace(/[^a-z0-9\s]/g, ' ')   // strip other punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

function wordsOf(normalized) {
  // Strip a trailing 's' for comparison only (tricep/triceps, curl/curls) —
  // still whole-word matching, just tolerant of singular/plural variance.
  return normalized.split(' ').filter(Boolean).map((w) => (w.endsWith('s') && w.length > 3 ? w.slice(0, -1) : w));
}

// True if every word of the shorter name appears in the longer name —
// so "standing calf raise" matches "standing calf raise machine" in
// either direction, regardless of which one has the equipment suffix.
function isContained(a, b) {
  const [shorter, longer] = a.length <= b.length ? [a, b] : [b, a];
  const shorterWords = wordsOf(shorter);
  const longerWords = new Set(wordsOf(longer));
  return shorterWords.length > 0 && shorterWords.every((w) => longerWords.has(w));
}

export function findMatchingExercise(templateName, exercises) {
  const normalizedTemplate = normalizeExerciseName(templateName);

  // 1. Exact match on the raw name (fastest path, handles perfect matches).
  const exact = exercises.find((ex) => ex.name.toLowerCase() === templateName.toLowerCase());
  if (exact) return exact;

  // 2. Exact match once both sides are normalized (strips equipment
  // suffixes/punctuation differences entirely).
  const normalizedExact = exercises.find(
    (ex) => normalizeExerciseName(ex.name) === normalizedTemplate
  );
  if (normalizedExact) return normalizedExact;

  // 3. Containment match — handles a suffix present on one side only,
  // or minor extra wording, without matching unrelated exercises.
  const contained = exercises.find((ex) =>
    isContained(normalizedTemplate, normalizeExerciseName(ex.name))
  );
  if (contained) return contained;

  return null;
}
