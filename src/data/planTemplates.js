// Starter templates — reference exercises by name (matched against the
// user's actual library via utils/exerciseMatching at apply-time, since
// Firestore document IDs vary per deployment and can't be hardcoded here).
// "Warm Up" is a synthetic entry, not a real library exercise — it's
// always included regardless of matching (see PlanTemplatesModal).
export const PLAN_TEMPLATES = [
  {
    id: 'push-day',
    name: 'Push Day',
    goal: 'general',
    daysPerWeek: 1,
    exercises: [
      { name: 'Warm Up', sets: 1, reps: 1, notes: '5-10 minutes' },
      { name: 'Bench Press (Barbell)', sets: 3, reps: 10 },
      { name: 'Incline Bench Press (Dumbbell)', sets: 3, reps: 10 },
      { name: 'Shoulder Press (Dumbbell)', sets: 3, reps: 10 },
      { name: 'Lateral Raise (Dumbbell)', sets: 3, reps: 10 },
      { name: 'Triceps Rope Pushdown', sets: 3, reps: 10 },
    ],
  },
  {
    id: 'pull-day',
    name: 'Pull Day',
    goal: 'general',
    daysPerWeek: 1,
    exercises: [
      { name: 'Warm Up', sets: 1, reps: 1 },
      { name: 'Lat Pulldown (Cable)', sets: 3, reps: 10 },
      { name: 'Seated Cable Row - V Grip (Cable)', sets: 3, reps: 10 },
      { name: 'Face Pull', sets: 3, reps: 10 },
      { name: 'Bicep Curl (Dumbbell)', sets: 3, reps: 10 },
      { name: 'Hammer Curl (Dumbbell)', sets: 3, reps: 10 },
    ],
  },
  {
    id: 'leg-day',
    name: 'Leg Day',
    goal: 'general',
    daysPerWeek: 1,
    exercises: [
      { name: 'Warm Up', sets: 1, reps: 1 },
      { name: 'Squat (Barbell)', sets: 3, reps: 10 },
      { name: 'Romanian Deadlift (Dumbbell)', sets: 3, reps: 10 },
      { name: 'Leg Press (Machine)', sets: 3, reps: 10 },
      { name: 'Seated Leg Curl (Machine)', sets: 3, reps: 10 },
      { name: 'Standing Calf Raise (Machine)', sets: 3, reps: 10 },
    ],
  },
  {
    id: 'upper-body-routine',
    name: 'Upper Body Routine',
    goal: 'general',
    daysPerWeek: 1,
    exercises: [
      { name: 'Warm Up', sets: 1, reps: 1 },
      { name: 'Bench Press (Dumbbell)', sets: 3, reps: 10 },
      { name: 'Lat Pulldown (Machine)', sets: 3, reps: 10 },
      { name: 'Seated Shoulder Press (Machine)', sets: 3, reps: 10 },
      { name: 'Seated Cable Row - Bar Grip', sets: 3, reps: 10 },
      { name: 'Cable Triceps Pushdown', sets: 3, reps: 10 },
    ],
  },
  {
    id: 'lower-body-routine',
    name: 'Lower Body Routine',
    goal: 'general',
    daysPerWeek: 1,
    exercises: [
      { name: 'Warm Up', sets: 1, reps: 1 },
      { name: 'Leg Press (Machine)', sets: 3, reps: 10 },
      { name: 'Hip Thrust (Barbell)', sets: 3, reps: 10 },
      { name: 'Leg Extension (Machine)', sets: 3, reps: 10 },
      { name: 'Seated Leg Curl (Machine)', sets: 3, reps: 10 },
      { name: 'Standing Calf Raise', sets: 3, reps: 10 },
    ],
  },
  {
    id: 'full-body-routine',
    name: 'Full Body Routine',
    goal: 'general',
    daysPerWeek: 1,
    exercises: [
      { name: 'Warm Up', sets: 1, reps: 1 },
      { name: 'Squat (Dumbbell)', sets: 3, reps: 10 },
      { name: 'Bench Press (Barbell)', sets: 3, reps: 10 },
      { name: 'Lat Pulldown (Cable)', sets: 3, reps: 10 },
      { name: 'Romanian Deadlift (Dumbbell)', sets: 3, reps: 10 },
      { name: 'Shoulder Press (Dumbbell)', sets: 3, reps: 10 },
    ],
  },
];
