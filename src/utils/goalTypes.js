// Every new-style goal stores its numbers under a uniform `metrics` shape
// ({ start, current, target, weeklyTarget? }), regardless of type — only
// the labels/units/direction differ per type. This keeps progress/trend
// calculations generic instead of needing per-type branching everywhere.
//
// Legacy goals (type: 'weight' | 'strength' | 'frequency' | 'custom') keep
// using their original flat startValue/currentValue/targetValue fields and
// are untouched by this — see isLegacyGoal().

const MUSCLE_MASS_HELP =
  'An estimate of how much of your body weight is muscle (not fat, bone, or water). Smart scales, DEXA scans, or a body composition test at a gym can give you an estimate. If you don\'t have access to one, leave this blank — it\'s optional.';

const BODY_FAT_HELP =
  'The percentage of your body weight that is fat. Common ways to measure it: smart/body-composition scales, skinfold calipers, DEXA scans, or an in-person assessment at a gym.';

const RESTING_HR_HELP =
  'Your heart rate while fully at rest — most accurate first thing in the morning, before getting out of bed, measured for 60 seconds (or use a fitness tracker/smart watch).';

export const GOAL_TYPES = [
  {
    value: 'lose-weight',
    label: 'Lose Weight',
    direction: 'decrease',
    unit: 'kg',
    fields: { start: 'Starting Weight', current: 'Current Weight', target: 'Target Weight' },
    hasWeeklyTarget: true,
    optionalTracking: ['Body fat %', 'Waist measurement'],
  },
  {
    value: 'gain-weight',
    label: 'Gain Weight',
    direction: 'increase',
    unit: 'kg',
    fields: { start: 'Starting Weight', current: 'Current Weight', target: 'Target Weight' },
    optionalTracking: ['Lean mass', 'Body fat %', 'Daily calorie intake'],
  },
  {
    value: 'build-muscle',
    label: 'Build Muscle',
    direction: 'increase',
    unit: 'kg',
    fields: { start: 'Starting Muscle Mass (optional)', current: 'Current Muscle Mass (optional)', target: 'Target Muscle Mass' },
    help: { start: MUSCLE_MASS_HELP, current: MUSCLE_MASS_HELP },
    metricsOptional: true,
    optionalTracking: ['Chest', 'Arms', 'Legs', 'Strength progression'],
  },
  {
    value: 'reduce-body-fat',
    label: 'Reduce Body Fat',
    direction: 'decrease',
    unit: '%',
    fields: { start: 'Starting Body Fat %', current: 'Current Body Fat %', target: 'Target Body Fat %' },
    help: { start: BODY_FAT_HELP, current: BODY_FAT_HELP, target: BODY_FAT_HELP },
    optionalTracking: ['Weight', 'Waist', 'Hip'],
  },
  {
    value: 'maintain-weight',
    label: 'Maintain Weight',
    direction: 'maintain',
    unit: 'kg',
    fields: { current: 'Current Weight', target: 'Target Weight' },
    hasTolerance: true,
    noDeadline: true,
    optionalTracking: ['Weekly weight trend', 'Calories', 'Activity level'],
  },
  {
    value: 'improve-strength',
    label: 'Improve Strength',
    direction: 'increase',
    unit: 'kg',
    fields: { start: 'Starting Lift', target: 'Target Lift' },
    requiresExercise: true,
    optionalTracking: ['Estimated 1RM', 'Workout frequency', 'Personal records'],
  },
  {
    value: 'improve-endurance',
    label: 'Improve Endurance',
    direction: 'increase',
    unit: '',
    fields: { start: 'Current Performance', target: 'Target Performance' },
    hasCustomUnit: true,
    help: { customUnit: 'Describe what you\'re tracking, e.g. "5K time (minutes)", "distance (km)", or "cycling distance (km)" — whatever performance number you want to improve.' },
    optionalTracking: ['VO₂ Max', 'Heart rate zones', 'Cardio sessions'],
  },
  {
    value: 'increase-flexibility',
    label: 'Increase Flexibility',
    direction: 'increase',
    unit: '',
    fields: { start: 'Current Mobility Level', target: 'Target Mobility Level' },
    hasCustomUnit: true,
    help: { customUnit: 'A number you use to track mobility — e.g. how far you can reach in a sit-and-reach test (cm), or a 1-10 self-rated flexibility score. Pick something you can measure consistently.' },
    optionalTracking: ['Stretching sessions', 'Range of motion'],
  },
  {
    value: 'improve-cardiovascular-health',
    label: 'Improve Cardiovascular Health',
    direction: 'decrease',
    unit: 'bpm',
    fields: { start: 'Starting Resting Heart Rate', current: 'Current Resting Heart Rate', target: 'Target Resting Heart Rate' },
    help: { start: RESTING_HR_HELP, current: RESTING_HR_HELP, target: RESTING_HR_HELP },
    optionalTracking: ['HRV', 'Blood pressure', 'Weekly cardio minutes'],
  },
  {
    value: 'general-fitness',
    label: 'General Fitness',
    direction: 'none',
    unit: '',
    fields: {},
    optionalTracking: ['Weekly workouts completed', 'Activity minutes', 'Fitness score'],
  },
];

const LEGACY_TYPES = ['weight', 'strength', 'frequency', 'custom'];

export function isLegacyGoal(goal) {
  return LEGACY_TYPES.includes(goal.type) || !goal.metrics;
}

export function getGoalTypeConfig(typeValue) {
  return GOAL_TYPES.find((t) => t.value === typeValue) || null;
}
