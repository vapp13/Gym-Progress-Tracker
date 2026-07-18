import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  createPlan,
  getUserPlans,
  updatePlan,
  deletePlan,
} from '../services/workoutPlans.service';

export function useWorkoutPlans() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserPlans(user.uid);
      setPlans(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const addPlan = async (planData) => {
    await createPlan(user.uid, planData);
    await fetchPlans();
  };

  const editPlan = async (planId, updates) => {
    await updatePlan(planId, updates);
    await fetchPlans();
  };

  const removePlan = async (planId) => {
    await deletePlan(planId);
    await fetchPlans();
  };

  return { plans, loading, error, addPlan, editPlan, removePlan, refetch: fetchPlans };
}