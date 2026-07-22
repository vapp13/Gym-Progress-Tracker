import { Trophy } from 'lucide-react';
import { usePersonalRecords } from '../../hooks/usePersonalRecords';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { SkeletonCard } from '../../components/Skeleton';
import PersonalRecordRow from './PersonalRecordRow';

function ProgressPersonalRecords({ limit }) {
  const { records, loading } = usePersonalRecords();

  if (loading) return <SkeletonCard />;

  const sorted = [...records].sort((a, b) => (b.heaviestWeight || 0) - (a.heaviestWeight || 0));
  const visible = limit ? sorted.slice(0, limit) : sorted;

  if (visible.length === 0) {
    return (
      <Card>
        <EmptyState message="Complete a workout to start setting personal records." icon={Trophy} />
      </Card>
    );
  }

  return (
    <Card>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {visible.map((r) => (
          <PersonalRecordRow key={r.id} record={r} />
        ))}
      </ul>
    </Card>
  );
}

export default ProgressPersonalRecords;
