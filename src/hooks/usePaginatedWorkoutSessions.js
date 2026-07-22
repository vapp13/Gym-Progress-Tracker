import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserSessionsPage } from '../services/workoutSessions.service';

const PAGE_SIZE = 20;

// Genuine Firestore-level pagination, separate from useWorkoutSessions
// (which fetches everything) — used specifically for the Workout History
// list view, since that's the one place session count can grow unbounded.
export function usePaginatedWorkoutSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchFirstPage = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await getUserSessionsPage(user.uid, PAGE_SIZE);
      setSessions(result.sessions);
      setCursor(result.lastDoc);
      setHasMore(result.hasMore);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  const loadMore = async () => {
    if (!user || !hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const result = await getUserSessionsPage(user.uid, PAGE_SIZE, cursor);
      setSessions((prev) => [...prev, ...result.sessions]);
      setCursor(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  return { sessions, loading, loadingMore, hasMore, loadMore, error, refetch: fetchFirstPage };
}
