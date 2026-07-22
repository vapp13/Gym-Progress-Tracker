// Achievement definitions — each one is derived from data that's already
// tracked elsewhere (streak, PR count, completed goals count), not a new
// tracking system. Streak achievements use the streak value publicProfiles
// already maintains; PR/goal achievements use small cumulative counters
// added alongside it.
export const ACHIEVEMENTS = [
  { key: 'streak-7', label: '7-Day Streak', check: (s) => s.streak >= 7 },
  { key: 'streak-30', label: '30-Day Streak', check: (s) => s.streak >= 30 },
  { key: 'streak-100', label: '100-Day Streak', check: (s) => s.streak >= 100 },
  { key: 'streak-365', label: '365-Day Streak', check: (s) => s.streak >= 365 },
  { key: 'first-pr', label: 'First Personal Record', check: (s) => s.prCount >= 1 },
  { key: 'pr-10', label: '10 Personal Records', check: (s) => s.prCount >= 10 },
  { key: 'pr-50', label: '50 Personal Records', check: (s) => s.prCount >= 50 },
  { key: 'first-goal', label: 'First Goal Completed', check: (s) => s.goalsCompletedCount >= 1 },
  { key: 'goals-5', label: '5 Goals Completed', check: (s) => s.goalsCompletedCount >= 5 },
];

// Given the current stats and the set of already-earned achievement keys,
// returns any newly-qualifying achievements (so callers only write the
// delta, not the whole list every time).
export function getNewlyEarnedAchievements(stats, existingKeys) {
  return ACHIEVEMENTS.filter((a) => !existingKeys.includes(a.key) && a.check(stats));
}
