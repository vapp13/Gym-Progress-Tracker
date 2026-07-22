import { calculateGoalProgress } from './goalProgress';

// Short, contextual progress messages — intentionally simple (not a
// general recommendation engine), derived from the same normalized
// progress calculation used everywhere else for this goal.
export function getGoalRecommendation(goal, measurements = []) {
  if (!goal) return null;

  const progress = calculateGoalProgress(goal, measurements);

  if (progress.isAchieved) return "You've hit your target! 🎉";
  if (progress.remaining === null) {
    return progress.daysRemaining !== null ? `${progress.daysRemaining} days left` : 'Keep going';
  }

  const remaining = Math.abs(progress.remaining);
  return `${remaining}${progress.unit} to go`;
}
