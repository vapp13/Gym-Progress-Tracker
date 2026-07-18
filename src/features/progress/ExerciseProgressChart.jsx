import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import EmptyState from '../../components/EmptyState';

function ExerciseProgressChart({ logs, exerciseId }) {
  if (!exerciseId) {
    return <EmptyState message="Select an exercise to view its progress." />;
  }

  const chartData = logs
    .filter((log) => log.exerciseId === exerciseId)
    .map((log) => ({ date: log.date, volume: log.value }));

  if (chartData.length === 0) {
    return <EmptyState message="No logged sets for this exercise yet." />;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData}>
        <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={11} />
        <YAxis stroke="var(--color-text-muted)" fontSize={11} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            color: 'var(--color-text)',
          }}
        />
        <Line
          type="monotone"
          dataKey="volume"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={{ fill: 'var(--color-primary)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ExerciseProgressChart;