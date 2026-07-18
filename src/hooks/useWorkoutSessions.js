import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  startSession,
  updateSession,
  completeSession,
  getUserSessions,
} from '../services/workoutSessions.service';

export function useWorkoutSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserSessions(user.uid);
      setSessions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const start = async (planId = null) => {
    const sessionId = await startSession(user.uid, planId);
    await fetchSessions();
    return sessionId;
  };

  const update = async (sessionId, updates) => {
    await updateSession(sessionId, updates);
    await fetchSessions();
  };

  const complete = async (sessionId, exercises) => {
    await completeSession(sessionId, user.uid, exercises);
    await fetchSessions();
  };

  return { sessions, loading, error, start, update, complete, refetch: fetchSessions };
}