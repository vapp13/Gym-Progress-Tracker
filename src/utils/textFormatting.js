// Splits a numbered instructions string like "1. Do this. 2. Do that."
// into an array of step strings, stripping the leading numbers so they
// can be rendered in a semantic <ol> (browser handles the numbering marker).
// If the text has no detectable numbered steps, returns it as a single
// paragraph so plain, non-numbered instructions still display normally.
export function splitNumberedSteps(text) {
  if (!text) return [];

  const rawSteps = text
    .split(/(?=\d+\.\s)/)
    .map((step) => step.trim())
    .filter(Boolean);

  if (rawSteps.length <= 1) return [text];

  return rawSteps.map((step) => step.replace(/^\d+\.\s*/, ''));
}

// Normalizes a field that may be stored as an array or a comma-separated
// string into a clean array of trimmed values.
export function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

// Display-only helper — capitalizes each word for dropdown labels, while
// leaving the underlying stored value (lowercase) untouched, since other
// code (e.g. difficulty tag CSS classes) depends on that exact casing.
export function toTitleCase(str) {
  if (!str) return str;
  return str.replace(/(^|[\s-])\S/g, (match) => match.toUpperCase());
}

// Short chart-axis date format, e.g. "2026-06-26" -> "Jun 26". Falls back
// to the original string if it isn't a parseable date.
export function formatShortDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
