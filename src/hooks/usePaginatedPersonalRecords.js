import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPersonalRecordsPage } from '../services/personalRecords.service';

const PAGE_SIZE = 10;

// Genuine Firestore-level pagination, separate from usePersonalRecords
// (which fetches everything) — used specifically for the full Personal
// Records page, since exercise count (400+) means an active user could
// have records for a large share of them.
export function usePaginatedPersonalRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchFirstPage = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await getPersonalRecordsPage(user.uid, PAGE_SIZE);
      setRecords(result.records);
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
      const result = await getPersonalRecordsPage(user.uid, PAGE_SIZE, cursor);
      setRecords((prev) => [...prev, ...result.records]);
      setCursor(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  return { records, loading, loadingMore, hasMore, loadMore, error, refetch: fetchFirstPage };
}
