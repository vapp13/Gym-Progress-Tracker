import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPersonalRecords } from '../services/personalRecords.service';

export function usePersonalRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getPersonalRecords(user.uid);
      setRecords(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return { records, loading, error, refetch: fetchRecords };
}
