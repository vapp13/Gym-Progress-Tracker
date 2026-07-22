import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '../../components/Card';
import { formatWeight } from '../../utils/units';
import { calculateAge } from '../../utils/age';
import { calculateBMI, calculateBMR, calculateTDEE, getBMICategory } from '../../utils/bodyMetrics';

function formatDate(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function ProgressSummaryCards({ measurements, units, profile }) {
  const latest = measurements[0];
  const first = measurements[measurements.length - 1];
  const weightChange = latest && first ? Math.round((latest.weight - first.weight) * 10) / 10 : null;

  const ChangeIcon = weightChange === null || weightChange === 0 ? Minus : weightChange > 0 ? TrendingUp : TrendingDown;

  const height = profile?.profile?.height || null;
  const age = calculateAge(profile?.profile?.dateOfBirth);
  const gender = profile?.profile?.gender;
  const activityLevel = profile?.profile?.activityLevel;
  const weight = latest?.weight || null;

  const bmi = weight && height ? calculateBMI(weight, height) : null;
  const bmr = weight && height && age ? calculateBMR(weight, height, age, gender) : null;
  const tdee = bmr ? calculateTDEE(bmr, activityLevel) : null;

  return (
    <Card>
      <div className="stat-box-grid" style={{ marginBottom: 0 }}>
        <div className="stat-box">
          <span className="stat-box-value">{latest ? formatWeight(latest.weight, units) : '—'}</span>
          <span className="stat-box-label">Current Weight</span>
        </div>
        <div className="stat-box">
          <span className="stat-box-value" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChangeIcon size={16} style={{ color: 'var(--color-text-faint)' }} />
            {weightChange !== null ? formatWeight(Math.abs(weightChange), units) : '—'}
          </span>
          <span className="stat-box-label">Change Since First Entry</span>
        </div>
        <div className="stat-box">
          <span className="stat-box-value" style={{ fontSize: 'var(--text-base)' }}>{formatDate(latest?.date)}</span>
          <span className="stat-box-label">Last Measurement</span>
        </div>
        <div className="stat-box">
          <span className="stat-box-value">{bmi ?? '—'}</span>
          <span className="stat-box-label">BMI{bmi && ` · ${getBMICategory(bmi)}`}</span>
        </div>
        <div className="stat-box">
          <span className="stat-box-value">{bmr ?? '—'}{bmr && <span className="stat-box-unit">kcal</span>}</span>
          <span className="stat-box-label">BMR</span>
        </div>
        <div className="stat-box">
          <span className="stat-box-value">{tdee ?? '—'}{tdee && <span className="stat-box-unit">kcal/day</span>}</span>
          <span className="stat-box-label">TDEE</span>
        </div>
      </div>
    </Card>
  );
}

export default ProgressSummaryCards;
