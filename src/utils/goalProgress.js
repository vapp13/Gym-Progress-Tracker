import { isLegacyGoal, getGoalTypeConfig } from './goalTypes';

function toDate(value) {
  if (!value) return null;
  if (value.toDate) return value.toDate();
  return new Date(value);
}

function daysBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

// Normalizes both legacy (flat) and new (metrics map) goal shapes into one
// common shape, so the rest of this module never has to branch on it.
function extractNumbers(goal) {
  if (isLegacyGoal(goal)) {
    return {
      start: goal.startValue,
      current: goal.currentValue,
      target: goal.targetValue,
      direction: goal.targetValue < goal.startValue ? 'decrease' : 'increase',
      hasMetric: true,
    };
  }

  const config = getGoalTypeConfig(goal.type);
  const metrics = goal.metrics || {};
  return {
    start: metrics.start,
    current: metrics.current ?? metrics.start,
    target: metrics.target,
    direction: config?.direction || 'increase',
    hasMetric: config?.direction !== 'none' && metrics.target !== undefined && metrics.target !== null,
  };
}

// Which body measurement field to compare for a "did the last entry move
// the right way" check — only goal types with an obvious matching field.
// Everything else (strength, endurance, flexibility, cardio, general
// fitness) has no obvious single measurement to compare and keeps using
// the pacing-based fallback below.
const TREND_MEASUREMENT_FIELD = {
  weight: 'weight',
  'lose-weight': 'weight',
  'gain-weight': 'weight',
  'maintain-weight': 'weight',
  'reduce-body-fat': 'bodyFatPercent',
  'build-muscle': 'muscleMass',
};

const NOISE_TOLERANCE = 0.1;

// Compares the two most recent measurement entries that actually have the
// relevant field recorded — this is what answers "did you move the right
// way recently", which the pacing heuristic below can't tell you (a goal
// can be on-pace overall while its last entry went the wrong way).
function calculateRecentTrend(goal, direction, measurements) {
  const fieldKey = TREND_MEASUREMENT_FIELD[goal.type];
  if (!fieldKey || !measurements || measurements.length === 0) return null;

  const withValue = [...measurements]
    .filter((m) => m[fieldKey] !== undefined && m[fieldKey] !== null)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (withValue.length < 2) return null;

  const [latest, previous] = withValue;
  const delta = latest[fieldKey] - previous[fieldKey];

  if (Math.abs(delta) <= NOISE_TOLERANCE) return 'Stable';
  if (direction === 'decrease') return delta < 0 ? 'Improving' : 'Behind';
  return delta > 0 ? 'Improving' : 'Behind';
}

// Improving / Stable / Behind — compares the rate of progress achieved so
// far against the rate still required to hit the target by the deadline.
// Used as a fallback for goal types with no measurement history to check
// recency against directly.
function calculatePacingTrend({ start, current, target, direction }, createdAt, deadline) {
  if (direction === 'none' || direction === 'maintain') return null;
  if (start === undefined || start === null || target === undefined || target === null) return null;
  if (!createdAt || !deadline) return null;

  const totalNeeded = Math.abs(target - start);
  if (totalNeeded === 0) return 'Stable';

  const achievedSoFar = direction === 'decrease' ? start - current : current - start;
  const now = new Date();
  const totalDays = Math.max(1, daysBetween(createdAt, deadline));
  const elapsedDays = Math.max(1, daysBetween(createdAt, now));

  const expectedProgressFraction = Math.min(1, elapsedDays / totalDays);
  const actualProgressFraction = achievedSoFar / totalNeeded;

  const diff = actualProgressFraction - expectedProgressFraction;
  if (diff >= -0.05) return 'Improving';
  if (diff >= -0.15) return 'Stable';
  return 'Behind';
}

export function calculateGoalProgress(goal, measurements = []) {
  const { start, current, target, direction, hasMetric } = extractNumbers(goal);
  const createdAt = toDate(goal.createdAt);
  const deadline = toDate(goal.deadline);
  const now = new Date();

  const daysRemaining = deadline ? daysBetween(now, deadline) : null;

  // No trackable number (e.g. General Fitness) — purely time-based.
  if (!hasMetric) {
    const percent = createdAt && deadline
      ? Math.max(0, Math.min(100, Math.round((daysBetween(createdAt, now) / Math.max(1, daysBetween(createdAt, deadline))) * 100)))
      : null;
    return {
      percent,
      remaining: null,
      unit: '',
      daysRemaining,
      estimatedCompletionDate: deadline,
      trend: null,
      isAchieved: false,
    };
  }

  let percent;
  let remaining;

  if (direction === 'maintain') {
    const deviation = target ? Math.abs(current - target) / target : 0;
    percent = Math.max(0, Math.round(100 - deviation * 500));
    remaining = Math.round((current - target) * 10) / 10;
  } else {
    const totalNeeded = target - start;
    const achieved = current - start;
    percent = totalNeeded === 0 ? 100 : Math.max(0, Math.min(100, Math.round((achieved / totalNeeded) * 100)));
    remaining = Math.round((target - current) * 10) / 10;
  }

  const isAchieved = direction === 'maintain' ? percent >= 90 : percent >= 100;

  // Simple linear projection from progress-so-far to estimate completion.
  let estimatedCompletionDate = deadline;
  if (createdAt && direction !== 'maintain' && direction !== 'none' && percent > 0 && percent < 100) {
    const elapsedDays = Math.max(1, daysBetween(createdAt, now));
    const totalDaysProjected = Math.round((elapsedDays / percent) * 100);
    estimatedCompletionDate = new Date(createdAt.getTime() + totalDaysProjected * 86400000);
  }

  const trend = calculateRecentTrend(goal, direction, measurements)
    ?? calculatePacingTrend({ start, current, target, direction }, createdAt, deadline);

  return {
    percent,
    remaining,
    unit: getGoalTypeConfig(goal.type)?.unit ?? '',
    daysRemaining,
    estimatedCompletionDate,
    trend,
    isAchieved,
  };
}
