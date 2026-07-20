import EmptyState from '../../components/EmptyState';
import Card from '../../components/Card';
import TrendLineChart from '../../components/TrendLineChart';

function BodyWeightChart({ measurements, targetWeight }) {
  if (measurements.length === 0) {
    return (
      <Card>
        <EmptyState message="No measurements logged yet." />
      </Card>
    );
  }

  const chartData = [...measurements]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((m) => ({ date: m.date, weight: m.weight }));

  return (
    <Card>
      <TrendLineChart
        data={chartData}
        dataKey="weight"
        color="var(--color-accent)"
        referenceValue={targetWeight}
        referenceLabel="Goal"
      />
    </Card>
  );
}

export default BodyWeightChart;
