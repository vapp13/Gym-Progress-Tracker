import EmptyState from '../../components/EmptyState';
import Card from '../../components/Card';
import TrendLineChart from '../../components/TrendLineChart';
import { getMeasurementField, getMeasurementValue, getMeasurementUnit, convertToDisplayUnits } from '../../utils/measurementFields';

function MeasurementChart({ measurements, fieldKey, units, targetWeight }) {
  const field = getMeasurementField(fieldKey);
  if (!field) return null;

  const chartData = [...measurements]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((entry) => ({
      date: entry.date,
      value: convertToDisplayUnits(getMeasurementValue(entry, field), field.unitType, units),
    }))
    .filter((point) => point.value !== null);

  if (chartData.length === 0) {
    return (
      <Card>
        <EmptyState message={`No ${field.label.toLowerCase()} entries logged yet.`} />
      </Card>
    );
  }

  const unit = getMeasurementUnit(field, units);
  const showTargetLine = field.key === 'weight' && targetWeight;
  const displayTarget = showTargetLine
    ? convertToDisplayUnits(targetWeight, 'weight', units)
    : undefined;

  return (
    <Card>
      <TrendLineChart
        data={chartData}
        dataKey="value"
        name={`${field.label}${unit ? ` (${unit})` : ''}`}
        color="var(--color-accent)"
        referenceValue={displayTarget}
        referenceLabel="Goal"
      />
    </Card>
  );
}

export default MeasurementChart;
