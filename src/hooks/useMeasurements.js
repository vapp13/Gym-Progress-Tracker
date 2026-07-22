import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  addMeasurement,
  getMeasurements,
  updateMeasurement,
  deleteMeasurement,
} from '../services/measurements.service';

export function useMeasurements() {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeasurements = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getMeasurements(user.uid);
      setMeasurements(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMeasurements();
  }, [fetchMeasurements]);

  const addEntry = async (measurementData) => {
    await addMeasurement(user.uid, measurementData);
    await fetchMeasurements();
  };

  // For bulk import — writes every entry first, then refetches once at
  // the end, rather than addEntry's one-write-one-refetch (which would
  // mean a full collection re-read per row for a large import).
  const bulkAddEntries = async (entriesData) => {
    for (const entryData of entriesData) {
      await addMeasurement(user.uid, entryData);
    }
    await fetchMeasurements();
  };

  const editEntry = async (entryId, updates) => {
    await updateMeasurement(user.uid, entryId, updates);
    await fetchMeasurements();
  };

  const removeEntry = async (entryId) => {
    await deleteMeasurement(user.uid, entryId);
    await fetchMeasurements();
  };

  return { measurements, loading, error, addEntry, bulkAddEntries, editEntry, removeEntry, refetch: fetchMeasurements };
}
