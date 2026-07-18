import { useState } from 'react';
import { useGoals } from '../hooks/useGoals';
import GoalCard from '../features/goals/GoalCard';
import GoalForm from '../features/goals/GoalForm';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

function Goals() {
  const { goals, loading, error, addGoal, editGoal, removeGoal } = useGoals();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  if (loading) return <p>Loading goals...</p>;
  if (error) return <p>Error: {error}</p>;

  const openCreateModal = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleSave = async (goalData) => {
    if (editingGoal) {
      await editGoal(editingGoal.id, goalData);
    } else {
      await addGoal(goalData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (goalId, goalType) => {
    if (window.confirm(`Delete "${goalType}" goal? This can't be undone.`)) {
      removeGoal(goalId);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Goals</h1>
        <Button variant="primary" onClick={openCreateModal}>
          + New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          message="You haven't set any goals yet."
          actionLabel="Create your first goal"
          onAction={openCreateModal}
        />
      ) : (
        <div>
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onClick={() => openEditModal(goal)}
              onDelete={() => handleDelete(goal.id, goal.type)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGoal ? 'Edit Goal' : 'New Goal'}
      >
        <GoalForm
          initialGoal={editingGoal}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default Goals;