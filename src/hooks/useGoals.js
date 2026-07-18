import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  createGoal,
  getUserGoals,
  updateGoal,
  deleteGoal,
} from '../services/goals.service';

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
    await createGoal(user.uid, goalData);
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

  return { goals, loading, error, addGoal, editGoal, removeGoal, refetch: fetchGoals };
}