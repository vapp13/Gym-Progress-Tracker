import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  createGoal,
  getUserGoals,
  updateGoal,
  deleteGoal,
  setActiveGoal,
  archiveGoal,
  completeGoal,
  unarchiveGoal,
} from '../services/goals.service';
import { syncAchievements } from '../services/publicProfile.service';

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoals = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserGoals(user.uid);
      setGoals(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async (goalData) => {
    const isFirstGoal = goals.length === 0;
    const newGoalId = await createGoal(user.uid, goalData);
    if (isFirstGoal) {
      await setActiveGoal(user.uid, newGoalId);
    }
    await fetchGoals();
  };

  const editGoal = async (goalId, updates) => {
    await updateGoal(goalId, updates);
    await fetchGoals();
  };

  const removeGoal = async (goalId) => {
    await deleteGoal(goalId);
    await fetchGoals();
  };

  const activateGoal = async (goalId) => {
    await setActiveGoal(user.uid, goalId);
    await fetchGoals();
  };

  const archive = async (goalId) => {
    await archiveGoal(goalId);
    await fetchGoals();
  };

  const complete = async (goalId) => {
    await completeGoal(goalId);
    await syncAchievements(user.uid, { goalJustCompleted: true });
    await fetchGoals();
  };

  // Moves a completed or archived goal back to Active. Doesn't make it
  // the active goal automatically — that's a separate, deliberate step.
  const reactivate = async (goalId) => {
    await unarchiveGoal(goalId);
    await fetchGoals();
  };

  return {
    goals,
    loading,
    error,
    addGoal,
    editGoal,
    removeGoal,
    activateGoal,
    archive,
    complete,
    reactivate,
    refetch: fetchGoals,
  };
}
