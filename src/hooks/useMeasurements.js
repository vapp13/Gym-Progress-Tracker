import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  addMeasurement,
  getMeasurements,
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

  const removeEntry = async (entryId) => {
    await deleteMeasurement(user.uid, entryId);
    await fetchMeasurements();
  };

  return { measurements, loading, error, addEntry, removeEntry, refetch: fetchMeasurements };
}