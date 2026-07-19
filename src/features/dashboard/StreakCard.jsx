import { Flame } from 'lucide-react';
import { useWorkoutSessions } from '../../hooks/useWorkoutSessions';
import Card from '../../components/Card';
import { SkeletonCard } from '../../components/Skeleton';

function calculateStreak(sessions) {
  const completedDates = sessions
    .filter((s) => s.status === 'completed' && s.completedAt?.toDate)
    .map((s) => {
      const d = s.completedAt.toDate();
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    });

  const uniqueDays = [...new Set(completedDates)].sort((a, b) => b - a);
  if (uniqueDays.length === 0) return 0;

  const oneDay = 86400000;
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  let streak = 0;

  // Allow streak to start from today or yesterday (so it doesn't reset the moment you wake up)
  if (uniqueDays[0] !== todayMidnight && uniqueDays[0] !== todayMidnight - oneDay) {
    return 0;
  }

  let cursor = uniqueDays[0];
  for (const day of uniqueDays) {
    if (day === cursor) {
      streak += 1;
      cursor -= oneDay;
    } else {
      break;
    }
  }

  return streak;
}

function StreakCard() {
  const { sessions, loading } = useWorkoutSessions();

  if (loading) return <SkeletonCard />;

  const streak = calculateStreak(sessions);

  return (
    <Card>
      <div className="card-icon-row">
        <span className="card-icon card-icon-accent"><Flame size={18} /></span>
        <span className="card-eyebrow">Streak</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700 }}>
          {streak}
        </span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          day{streak === 1 ? '' : 's'} in a row
        </span>
      </div>
    </Card>
  );
}

export default StreakCard;
