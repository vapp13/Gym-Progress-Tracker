import { useEffect, useState } from 'react';
import { getExercises } from '../services/exercises.service';

export function useExercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchExercises() {
      try {
        const data = await getExercises();
        if (isMounted) setExercises(data);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchExercises();

    return () => {
      isMounted = false;
    };
  }, []);

  return { exercises, loading, error };
}