import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import GoalCard from '../features/goals/GoalCard';
import GoalForm from '../features/goals/GoalForm';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import { getGoalBucket } from '../utils/goalBucket';

function Goals() {
  const { goals, loading, error, addGoal, removeGoal, activateGoal, archive, reactivate } = useGoals();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  if (error) return <p aria-live="assertive">Error: {error}</p>;

  const activeGoals = goals.filter((g) => getGoalBucket(g) === 'active');
  const completedGoals = goals.filter((g) => getGoalBucket(g) === 'completed');
  const archivedGoals = goals.filter((g) => getGoalBucket(g) === 'archived');

  const handleSave = async (goalData) => {
    await addGoal(goalData);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (pendingDelete) removeGoal(pendingDelete.id);
    setPendingDelete(null);
  };

  const renderGoalList = (list) => (
    <div>
      {list.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onClick={() => navigate(`/goals/${goal.id}`)}
          onDelete={() => setPendingDelete(goal)}
          onArchive={() => archive(goal.id)}
          onSetActive={() => activateGoal(goal.id)}
          onReactivate={() => reactivate(goal.id)}
        />
      ))}
    </div>
  );

  return (
    <div className="page-container">
      <PageHeader title="Goals" showBack sticky />

      {loading ? (
        <div aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2].map((i) => <Skeleton key={i} height="90px" radius="var(--radius-lg)" />)}
        </div>
      ) : activeGoals.length === 0 ? (
        <EmptyState
          message="You haven't set any goals yet."
          actionLabel="Create your first goal"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        renderGoalList(activeGoals)
      )}

      <div style={{ margin: 'var(--space-md) 0' }}>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)} style={{ width: '100%' }}>
          New Goal
        </Button>
      </div>

      {completedGoals.length > 0 && (
        <>
          <button className="todays-workout-change" onClick={() => setShowCompleted((prev) => !prev)}>
            {showCompleted ? 'Hide' : 'Show'} completed goals ({completedGoals.length})
          </button>
          {showCompleted && <div style={{ marginTop: 'var(--space-sm)' }}>{renderGoalList(completedGoals)}</div>}
        </>
      )}

      {archivedGoals.length > 0 && (
        <>
          <button className="todays-workout-change" onClick={() => setShowArchived((prev) => !prev)} style={{ marginTop: 'var(--space-sm)' }}>
            {showArchived ? 'Hide' : 'Show'} archived goals ({archivedGoals.length})
          </button>
          {showArchived && <div style={{ marginTop: 'var(--space-sm)' }}>{renderGoalList(archivedGoals)}</div>}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Goal"
      >
        <GoalForm
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmModal
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Goal"
        message={`Are you sure you want to delete this goal? This can't be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

export default Goals;
