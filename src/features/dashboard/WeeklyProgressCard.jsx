import { CalendarCheck } from 'lucide-react';
import { useWorkoutSessions } from '../../hooks/useWorkoutSessions';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useGoals } from '../../hooks/useGoals';
import Card from '../../components/Card';
import ProgressRing from '../../components/ProgressRing';
import { SkeletonCard } from '../../components/Skeleton';

function startOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday as start
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function WeeklyProgressCard() {
  const { sessions, loading: sessionsLoading } = useWorkoutSessions();
  const { data: profile, loading: profileLoading } = useUserProfile();
  const { goals, loading: goalsLoading } = useGoals();

  if (sessionsLoading || profileLoading || goalsLoading || !profile) return <SkeletonCard />;

  const weekStart = startOfWeek();
  const completedThisWeek = sessions.filter((s) => {
    if (s.status !== 'completed' || !s.completedAt?.toDate) return false;
    return s.completedAt.toDate() >= weekStart;
  }).length;

  const activeFrequencyGoal = goals.find((g) => g.isActive && g.type === 'frequency');
  const target = activeFrequencyGoal?.targetValue || profile.trainingPreferences?.daysPerWeek || 3;
  const percent = Math.round((completedThisWeek / target) * 100);

  return (
    <Card>
      <div className="card-icon-row">
        <span className="card-icon card-icon-primary"><CalendarCheck size={18} /></span>
        <span className="card-eyebrow">Weekly Progress</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
        <ProgressRing percent={percent} size={76} strokeWidth={7} label={`${completedThisWeek}/${target}`} sublabel="days" />
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          {completedThisWeek >= target
            ? "You've hit your weekly target! 🎉"
            : `${target - completedThisWeek} more session${target - completedThisWeek === 1 ? '' : 's'} to reach your goal.`}
        </p>
      </div>
    </Card>
  );
}

export default WeeklyProgressCard;
