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
import Card from '../../components/Card';

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
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} width={32} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: 12,
              color: 'var(--color-text)',
              fontSize: 13,
            }}
          />
          <Line
            type="monotone"
            dataKey="volume"
            stroke="var(--color-primary)"
            strokeWidth={2.5}
            dot={{ fill: 'var(--color-primary)', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default ExerciseProgressChart;
