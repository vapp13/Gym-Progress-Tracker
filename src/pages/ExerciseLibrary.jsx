import { useState, useMemo } from 'react';
import { useExercises } from '../hooks/useExercises';
import ExerciseFilters from '../features/exercises/ExerciseFilters';
import ExerciseCard from '../features/exercises/ExerciseCard';
import ExerciseDetailModal from '../features/exercises/ExerciseDetailModal';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';

function ExerciseLibrary() {
  const { exercises, loading, error } = useExercises();
  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
      const matchesGroup = !muscleGroup || ex.muscleGroup === muscleGroup;
      return matchesSearch && matchesGroup;
    });
  }, [exercises, search, muscleGroup]);

  if (error) return <p aria-live="assertive">Error: {error}</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Exercises</h1>
      </div>

      <ExerciseFilters
        exercises={exercises}
        searchValue={search}
        onSearchChange={setSearch}
        activeMuscleGroup={muscleGroup}
        onMuscleGroupChange={setMuscleGroup}
      />

      {loading ? (
        <div aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height="66px" radius="var(--radius-lg)" />
          ))}
        </div>
      ) : filteredExercises.length === 0 ? (
        <EmptyState message="No exercises match your search." />
      ) : (
        <div>
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onClick={() => setSelectedExercise(exercise)}
            />
          ))}
        </div>
      )}

      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </div>
  );
}

export default ExerciseLibrary;
