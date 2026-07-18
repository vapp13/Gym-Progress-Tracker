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

function BodyWeightChart({ measurements }) {
  if (measurements.length === 0) {
    return <EmptyState message="No measurements logged yet." />;
  }

  const chartData = [...measurements]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((m) => ({ date: m.date, weight: m.weight }));

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
          dataKey="weight"
          stroke="var(--color-accent)"
          strokeWidth={2}
          dot={{ fill: 'var(--color-accent)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default BodyWeightChart;