import { Trophy } from 'lucide-react';
import { usePersonalRecords } from '../../hooks/usePersonalRecords';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { SkeletonCard } from '../../components/Skeleton';

function PersonalRecordsCard() {
  const { records, loading } = usePersonalRecords();

  if (loading) return <SkeletonCard />;

  const topRecords = [...records]
    .sort((a, b) => (b.heaviestWeight || 0) - (a.heaviestWeight || 0))
    .slice(0, 3);

  return (
    <Card>
      <div className="card-icon-row">
        <span className="card-icon card-icon-accent"><Trophy size={18} /></span>
        <span className="card-eyebrow">Personal Records</span>
      </div>
      {topRecords.length === 0 ? (
        <div style={{ marginTop: 12 }}>
          <EmptyState message="Complete a workout to set your first record." />
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: '12px 0 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topRecords.map((r) => (
            <li key={r.id} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                <span>{r.exerciseName}</span>
                <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{r.heaviestWeight}kg</span>
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Est. 1RM {r.bestEstimated1RM}kg · Best set {r.bestReps} reps
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default PersonalRecordsCard;
