// Classifies a goal into one of three organizational buckets. Backward
// compatible with goals created before the Completed bucket existed —
// those only ever had `archived: true/false` plus a status string, so
// any old archived goal (regardless of its old status value) lands in
// Archived rather than being silently reclassified as Completed.
export function getGoalBucket(goal) {
  if (goal.status === 'completed') return 'completed';
  if (goal.status === 'archived' || goal.archived) return 'archived';
  return 'active';
}
