import EmptyState from '../../components/EmptyState';
import Card from '../../components/Card';
import TrendLineChart from '../../components/TrendLineChart';

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
      <TrendLineChart data={chartData} dataKey="volume" color="var(--color-primary)" />
    </Card>
  );
}

export default ExerciseProgressChart;
