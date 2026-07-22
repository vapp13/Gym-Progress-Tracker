import { Trophy } from 'lucide-react';
import { usePaginatedPersonalRecords } from '../hooks/usePaginatedPersonalRecords';
import PersonalRecordRow from '../features/progress/PersonalRecordRow';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/Skeleton';

function PersonalRecords() {
  const { records, loading, loadingMore, hasMore, loadMore, error } = usePaginatedPersonalRecords();

  if (error) return <p aria-live="assertive">Error: {error}</p>;

  return (
    <div className="page-container">
      <PageHeader title="Personal Records" showBack sticky />

      {loading ? (
        <SkeletonCard />
      ) : records.length === 0 ? (
        <EmptyState message="Complete a workout to start setting personal records." icon={Trophy} />
      ) : (
        <>
          <Card>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {records.map((r) => (
                <PersonalRecordRow key={r.id} record={r} />
              ))}
            </ul>
          </Card>

          {hasMore && (
            <Button
              variant="secondary"
              onClick={loadMore}
              disabled={loadingMore}
              style={{ width: '100%', marginTop: 'var(--space-sm)' }}
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default PersonalRecords;
