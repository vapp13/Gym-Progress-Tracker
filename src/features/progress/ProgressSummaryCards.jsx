import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '../../components/Card';
import { calculateGoalProgress } from '../../utils/goalProgress';
import { formatWeight } from '../../utils/units';

function formatDate(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function ProgressSummaryCards({ measurements, activeGoal, units }) {
  const latest = measurements[0];
  const first = measurements[measurements.length - 1];
  const weightChange = latest && first ? Math.round((latest.weight - first.weight) * 10) / 10 : null;

  const ChangeIcon = weightChange === null || weightChange === 0 ? Minus : weightChange > 0 ? TrendingUp : TrendingDown;
  const goalProgress = activeGoal ? calculateGoalProgress(activeGoal) : null;

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
          <span className="stat-box-value">{goalProgress ? `${goalProgress.percent ?? 0}%` : '—'}</span>
          <span className="stat-box-label">Active Goal Progress</span>
        </div>
        <div className="stat-box">
          <span className="stat-box-value" style={{ fontSize: 'var(--text-base)' }}>{formatDate(latest?.date)}</span>
          <span className="stat-box-label">Last Measurement</span>
        </div>
      </div>
    </Card>
  );
}

export default ProgressSummaryCards;
