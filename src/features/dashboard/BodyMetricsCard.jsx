import { useNavigate } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { useMeasurements } from '../../hooks/useMeasurements';
import { useUserProfile } from '../../hooks/useUserProfile';
import { calculateBMI, getBMICategory } from '../../utils/bodyMetrics';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { SkeletonCard } from '../../components/Skeleton';

function BodyMetricsCard() {
  const { measurements, loading: measurementsLoading } = useMeasurements();
  const { data: profile, loading: profileLoading } = useUserProfile();
  const navigate = useNavigate();

  if (measurementsLoading || profileLoading) return <SkeletonCard />;

  const latest = measurements[0];
  const previous = measurements[1];
  const delta = latest && previous ? +(latest.weight - previous.weight).toFixed(1) : null;
  const bmi = latest && profile?.profile.height ? calculateBMI(latest.weight, profile.profile.height) : null;

  return (
    <Card interactive onClick={() => navigate('/body-metrics')}>
      <div className="card-icon-row">
        <span className="card-icon card-icon-success"><Scale size={18} /></span>
        <span className="card-eyebrow">Body Metrics</span>
      </div>
      {latest ? (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700 }}>
            {latest.weight}
          </span>
          <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>kg</span>
          {delta !== null && (
            <span style={{ fontSize: 'var(--text-xs)', color: delta <= 0 ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
              {delta > 0 ? `+${delta}` : delta} kg
            </span>
          )}
          {bmi && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginLeft: 'auto' }}>
              BMI {bmi} · {getBMICategory(bmi)}
            </span>
          )}
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          <EmptyState message="No measurements logged yet." actionLabel="Add measurement" onAction={() => navigate('/progress')} />
        </div>
      )}
    </Card>
  );
}

export default BodyMetricsCard;
