import { useParams } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { useExercises } from '../hooks/useExercises';
import { useProgressLogs } from '../hooks/useProgressLogs';
import { usePersonalRecords } from '../hooks/usePersonalRecords';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import TrendLineChart from '../components/TrendLineChart';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/Skeleton';

function StatBox({ label, value, unit }) {
  return (
    <div className="stat-box">
      <span className="stat-box-value">{value}{unit && <span className="stat-box-unit">{unit}</span>}</span>
      <span className="stat-box-label">{label}</span>
    </div>
  );
}

function ExerciseHistory() {
  const { exerciseId } = useParams();
  const { exercises, loading: exercisesLoading } = useExercises();
  const { logs, loading: logsLoading } = useProgressLogs();
  const { records, loading: recordsLoading } = usePersonalRecords();

  const loading = exercisesLoading || logsLoading || recordsLoading;

  if (loading) {
    return (
      <div className="page-container" aria-live="polite">
        <SkeletonCard />
        <div style={{ marginTop: 12 }}><SkeletonCard /></div>
      </div>
    );
  }

  const exercise = exercises.find((ex) => ex.id === exerciseId);
  const record = records.find((r) => r.id === exerciseId);
  const exerciseLogs = logs
    .filter((log) => log.exerciseId === exerciseId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const totalVolume = exerciseLogs.reduce((sum, log) => sum + (log.value || 0), 0);
  const strengthData = exerciseLogs
    .filter((log) => log.bestWeight)
    .map((log) => ({ date: log.date, bestWeight: log.bestWeight }));
  const volumeData = exerciseLogs.map((log) => ({ date: log.date, volume: log.value }));

  return (
    <div className="page-container">
      <PageHeader title={exercise?.name || 'Exercise History'} showBack sticky />

      {exerciseLogs.length === 0 ? (
        <EmptyState message="No sessions logged for this exercise yet." icon={Dumbbell} />
      ) : (
        <>
          <div className="stat-box-grid">
            <StatBox label="Sessions" value={exerciseLogs.length} />
            <StatBox label="Best Weight" value={record?.heaviestWeight ?? '—'} unit="kg" />
            <StatBox label="Best Reps" value={record?.bestReps ?? '—'} />
            <StatBox label="Est. 1RM" value={record?.bestEstimated1RM ?? '—'} unit="kg" />
            <StatBox label="Total Volume" value={Math.round(totalVolume).toLocaleString()} unit="kg" />
            <StatBox label="Best Session Vol." value={record?.bestSessionVolume ?? '—'} unit="kg" />
          </div>

          <div className="section-title">Strength Progression</div>
          {strengthData.length > 0 ? (
            <Card>
              <TrendLineChart data={strengthData} dataKey="bestWeight" color="var(--color-primary)" />
            </Card>
          ) : (
            <Card><EmptyState message="Not enough data yet." /></Card>
          )}

          <div className="section-title">Volume Progression</div>
          <Card>
            <TrendLineChart data={volumeData} dataKey="volume" color="var(--color-accent)" />
          </Card>
        </>
      )}
    </div>
  );
}

export default ExerciseHistory;
