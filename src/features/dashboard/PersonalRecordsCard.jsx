import { Trophy } from 'lucide-react';
import { useProgressLogs } from '../../hooks/useProgressLogs';
import { useExercises } from '../../hooks/useExercises';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { SkeletonCard } from '../../components/Skeleton';

function PersonalRecordsCard() {
  const { logs, loading: logsLoading } = useProgressLogs();
  const { exercises, loading: exercisesLoading } = useExercises();

  if (logsLoading || exercisesLoading) return <SkeletonCard />;

  const bestByExercise = {};
  logs.forEach((log) => {
    if (log.metric !== 'volume') return;
    if (!bestByExercise[log.exerciseId] || log.value > bestByExercise[log.exerciseId]) {
      bestByExercise[log.exerciseId] = log.value;
    }
  });

  const records = Object.entries(bestByExercise)
    .map(([exerciseId, value]) => ({
      name: exercises.find((ex) => ex.id === exerciseId)?.name || 'Unknown exercise',
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <Card>
      <div className="card-icon-row">
        <span className="card-icon card-icon-accent"><Trophy size={18} /></span>
        <span className="card-eyebrow">Personal Records</span>
      </div>
      {records.length === 0 ? (
        <div style={{ marginTop: 12 }}>
          <EmptyState message="Complete a workout to set your first record." />
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: '12px 0 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.map((r) => (
            <li key={r.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
              <span>{r.name}</span>
              <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{r.value} vol</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default PersonalRecordsCard;
