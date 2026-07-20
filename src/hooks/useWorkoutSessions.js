import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  startSession,
  updateSession,
  completeSession,
  getUserSessions,
  getActiveSession,
  pauseSession,
  resumeSession,
  abandonSession,
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

  const start = async (planId = null, planName = null) => {
    const sessionId = await startSession(user.uid, planId, planName);
    await fetchSessions();
    return sessionId;
  };

  // For general updates where the list view should reflect the change.
  const update = async (sessionId, updates) => {
    await updateSession(sessionId, updates);
    await fetchSessions();
  };

  // For frequent in-session autosaves — writes without refetching the
  // whole session list, since nothing outside the active session needs
  // to know about it mid-workout.
  const saveProgress = async (sessionId, updates) => {
    await updateSession(sessionId, updates);
  };

  const complete = async (sessionId, exercises, notes = '') => {
    await completeSession(sessionId, user.uid, exercises, notes);
    await fetchSessions();
  };

  const pause = async (sessionId) => {
    await pauseSession(sessionId);
  };

  const resume = async (sessionId) => {
    await resumeSession(sessionId);
  };

  const discard = async (sessionId) => {
    await abandonSession(sessionId);
    await fetchSessions();
  };

  const findActiveSession = async () => {
    return getActiveSession(user.uid);
  };

  return {
    sessions,
    loading,
    error,
    start,
    update,
    saveProgress,
    complete,
    pause,
    resume,
    discard,
    findActiveSession,
    refetch: fetchSessions,
  };
}
