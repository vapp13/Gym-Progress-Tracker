import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, Star, Archive, Trash2, Plus, CheckCircle, RotateCcw } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import { useGoalProgressLogs } from '../hooks/useGoalProgressLogs';
import { calculateGoalProgress } from '../utils/goalProgress';
import { isLegacyGoal, getGoalTypeConfig } from '../utils/goalTypes';
import { getGoalBucket } from '../utils/goalBucket';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import ProgressBar from '../components/ProgressBar';
import TrendIndicator from '../features/goals/TrendIndicator';
import GoalForm from '../features/goals/GoalForm';
import { SkeletonCard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

function getGoalLabel(goal) {
  if (isLegacyGoal(goal)) return goal.type;
  return getGoalTypeConfig(goal.type)?.label || goal.type;
}

function formatDate(date) {
  if (!date) return '—';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function AddLogEntryForm({ onAdd, onCancel }) {
  const [metricKey, setMetricKey] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ metricKey, value: Number(value), date });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <label className="form-field">
        <span>Metric (e.g. "VO2 Max", "Resting HR", "Cardio minutes")</span>
        <input type="text" value={metricKey} onChange={(e) => setMetricKey(e.target.value)} required />
      </label>
      <label className="form-field">
        <span>Value</span>
        <input type="number" step="0.1" value={value} onChange={(e) => setValue(e.target.value)} required />
      </label>
      <label className="form-field">
        <span>Date</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <div className="goal-form-actions">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">Add Entry</Button>
      </div>
    </form>
  );
}

function GoalDetail() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const { goals, loading, editGoal, removeGoal, archive, complete, reactivate, activateGoal } = useGoals();
  const { logs, loading: logsLoading, addEntry, removeEntry } = useGoalProgressLogs(goalId);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (loading) {
    return (
      <div className="page-container" aria-live="polite">
        <SkeletonCard />
      </div>
    );
  }

  const goal = goals.find((g) => g.id === goalId);

  if (!goal) {
    return (
      <div className="page-container">
        <PageHeader title="Goal" showBack />
        <EmptyState message="Goal not found." />
      </div>
    );
  }

  const progress = calculateGoalProgress(goal);
  const typeConfig = !isLegacyGoal(goal) ? getGoalTypeConfig(goal.type) : null;
  const bucket = getGoalBucket(goal);

  const handleSaveEdit = async (updatedGoal) => {
    await editGoal(goal.id, updatedGoal);
    setIsEditOpen(false);
  };

  const handleConfirmDelete = () => {
    removeGoal(goal.id);
    navigate('/goals');
  };

  const handleArchive = async () => {
    await archive(goal.id);
    navigate('/goals');
  };

  const handleComplete = async () => {
    await complete(goal.id);
  };

  const handleReactivate = async () => {
    await reactivate(goal.id);
  };

  return (
    <div className="page-container">
      <PageHeader
        title={getGoalLabel(goal)}
        showBack
        sticky
        actions={
          <button className="session-icon-btn" onClick={() => setIsEditOpen(true)} aria-label="Edit goal">
            <Edit2 size={16} />
          </button>
        }
      />

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
          <span className={`goal-status goal-status-${goal.status}`}>{goal.status}</span>
          <TrendIndicator trend={progress.trend} />
        </div>

        {progress.percent !== null && (
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <ProgressBar current={progress.percent} target={100} color="var(--color-accent)" />
          </div>
        )}

        <div className="stat-box-grid">
          <div className="stat-box">
            <span className="stat-box-value">{progress.percent ?? '—'}{progress.percent !== null && '%'}</span>
            <span className="stat-box-label">Complete</span>
          </div>
          <div className="stat-box">
            <span className="stat-box-value">
              {progress.remaining !== null ? `${Math.abs(progress.remaining)}${progress.unit}` : '—'}
            </span>
            <span className="stat-box-label">Remaining</span>
          </div>
          <div className="stat-box">
            <span className="stat-box-value">{progress.daysRemaining ?? '—'}</span>
            <span className="stat-box-label">Days Left</span>
          </div>
          <div className="stat-box">
            <span className="stat-box-value" style={{ fontSize: 'var(--text-base)' }}>
              {formatDate(progress.estimatedCompletionDate)}
            </span>
            <span className="stat-box-label">Est. Completion</span>
          </div>
        </div>

        {bucket === 'active' && progress.isAchieved && (
          <p style={{ marginTop: 'var(--space-md)', fontSize: 'var(--text-sm)', color: 'var(--color-success)' }}>
            Looks like you've hit your target — want to mark this goal complete?
          </p>
        )}

        {goal.notes && (
          <p style={{ marginTop: 'var(--space-md)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
            "{goal.notes}"
          </p>
        )}
      </Card>

      {typeConfig?.optionalTracking?.length > 0 && (
        <>
          <div className="page-header" style={{ marginTop: 'var(--space-lg)' }}>
            <h2>Tracking Log</h2>
            <Button variant="secondary" size="sm" icon={Plus} onClick={() => setIsLogOpen(true)}>
              Add Entry
            </Button>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', margin: '0 0 var(--space-md) 0' }}>
            Suggested for this goal: {typeConfig.optionalTracking.join(', ')}
          </p>

          {logsLoading ? (
            <SkeletonCard />
          ) : logs.length === 0 ? (
            <EmptyState message="No entries logged yet." />
          ) : (
            logs.map((entry) => (
              <Card key={entry.id} style={{ marginBottom: 'var(--space-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-sm)' }}>{entry.metricKey}</p>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{entry.date}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{entry.value}</span>
                    <button className="goal-card-action-btn goal-card-action-delete" onClick={() => removeEntry(entry.id)} aria-label="Delete entry" title="Delete entry">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </>
      )}

      <div style={{ marginTop: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {bucket === 'active' && (
          <>
            {!goal.isActive && (
              <Button variant="secondary" icon={Star} onClick={() => activateGoal(goal.id)} style={{ width: '100%' }}>
                Set as Active Goal
              </Button>
            )}
            <Button variant="secondary" icon={CheckCircle} onClick={handleComplete} style={{ width: '100%' }}>
              Mark as Complete
            </Button>
            <Button variant="secondary" icon={Archive} onClick={handleArchive} style={{ width: '100%' }}>
              Archive Goal
            </Button>
          </>
        )}
        {bucket !== 'active' && (
          <Button variant="secondary" icon={RotateCcw} onClick={handleReactivate} style={{ width: '100%' }}>
            Reactivate Goal
          </Button>
        )}
        <Button variant="danger" icon={Trash2} onClick={() => setIsDeleteOpen(true)} style={{ width: '100%' }}>
          Delete Goal
        </Button>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Goal">
        <GoalForm initialGoal={goal} onSave={handleSaveEdit} onCancel={() => setIsEditOpen(false)} />
      </Modal>

      <Modal isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} title="Add Tracking Entry">
        <AddLogEntryForm
          onAdd={async (entry) => {
            await addEntry(entry);
            setIsLogOpen(false);
          }}
          onCancel={() => setIsLogOpen(false)}
        />
      </Modal>

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Goal"
        message={`Are you sure you want to delete "${getGoalLabel(goal)}"? This can't be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

export default GoalDetail;
