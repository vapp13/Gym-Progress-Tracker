import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

function TrendLineChart({ data, dataKey, color = 'var(--color-primary)', height = 200, referenceValue, referenceLabel }) {
  let domain;
  if (referenceValue !== undefined && referenceValue !== null) {
    const values = data.map((d) => d[dataKey]).filter((v) => typeof v === 'number');
    const allValues = [...values, referenceValue];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = Math.max((max - min) * 0.15, 1);
    domain = [Math.floor(min - padding), Math.ceil(max + padding)];
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          stroke="var(--color-text-muted)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={32}
          domain={domain}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: 12,
            color: 'var(--color-text)',
            fontSize: 13,
          }}
        />
        {referenceValue !== undefined && referenceValue !== null && (
          <ReferenceLine
            y={referenceValue}
            stroke="var(--color-accent)"
            strokeDasharray="4 4"
            label={{ value: referenceLabel || 'Target', position: 'insideTopRight', fill: 'var(--color-accent)', fontSize: 11 }}
          />
        )}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2.5}
          dot={{ fill: color, r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default TrendLineChart;
