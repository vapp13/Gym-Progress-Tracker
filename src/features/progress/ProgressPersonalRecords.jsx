import { Trophy } from 'lucide-react';
import { usePersonalRecords } from '../../hooks/usePersonalRecords';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { SkeletonCard } from '../../components/Skeleton';

function ProgressPersonalRecords() {
  const { records, loading } = usePersonalRecords();

  if (loading) return <SkeletonCard />;

  const sorted = [...records].sort((a, b) => (b.heaviestWeight || 0) - (a.heaviestWeight || 0));

  if (sorted.length === 0) {
    return (
      <Card>
        <EmptyState message="Complete a workout to start setting personal records." icon={Trophy} />
      </Card>
    );
  }

  return (
    <Card>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sorted.map((r) => (
          <li key={r.id} style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 12, borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              <span>{r.exerciseName}</span>
              <span style={{ color: 'var(--color-accent)' }}>{r.heaviestWeight}kg</span>
            </div>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Est. 1RM {r.bestEstimated1RM}kg · Best set {r.bestReps} reps · Best session volume {r.bestSessionVolume}kg
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default ProgressPersonalRecords;
