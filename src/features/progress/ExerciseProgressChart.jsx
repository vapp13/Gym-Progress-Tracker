import EmptyState from '../../components/EmptyState';
import Card from '../../components/Card';
import TrendLineChart from '../../components/TrendLineChart';
import Tooltip from '../../components/Tooltip';

function ExerciseProgressChart({ logs, exerciseId }) {
  if (!exerciseId) {
    return (
      <Card>
        <EmptyState message="Select an exercise to view its progress." />
      </Card>
    );
  }

  const chartData = logs
    .filter((log) => log.exerciseId === exerciseId)
    .map((log) => ({ date: log.date, volume: log.value }));

  if (chartData.length === 0) {
    return (
      <Card>
        <EmptyState message="No logged sets for this exercise yet." />
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
        <span className="card-eyebrow">Training Volume</span>
        <Tooltip text="Training Volume = Weight × Reps × Sets — a single number representing the total work done for this exercise in a session." />
      </div>
      <TrendLineChart data={chartData} dataKey="volume" name="Training Volume" color="var(--color-primary)" />
    </Card>
  );
}

export default ExerciseProgressChart;
