import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  addProgressLogEntry,
  getGoalProgressLogs,
  deleteProgressLogEntry,
} from '../services/goalProgressLogs.service';

export function useGoalProgressLogs(goalId) {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    if (!user || !goalId) return;
    setLoading(true);
    try {
      const data = await getGoalProgressLogs(user.uid, goalId);
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, goalId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const addEntry = async (entry) => {
    await addProgressLogEntry(user.uid, goalId, entry);
    await fetchLogs();
  };

  const removeEntry = async (entryId) => {
    await deleteProgressLogEntry(user.uid, entryId);
    await fetchLogs();
  };

  return { logs, loading, error, addEntry, removeEntry, refetch: fetchLogs };
}
