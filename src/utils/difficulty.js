// Exercise difficulty is free-text data entered directly in Firestore, so
// it may not always be perfectly lowercase/trimmed (e.g. "Beginner " vs
// "beginner"). Normalizing here means CSS class names and filter matching
// both work regardless of how it was actually typed in.
const VALID_LEVELS = ['beginner', 'intermediate', 'advanced'];

export function normalizeDifficulty(value) {
  if (!value) return null;
  const normalized = String(value).trim().toLowerCase();
  return VALID_LEVELS.includes(normalized) ? normalized : null;
}
