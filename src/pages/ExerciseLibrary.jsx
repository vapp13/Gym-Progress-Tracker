import { useState, useMemo } from 'react';
import { useExercises } from '../hooks/useExercises';
import ExerciseFilters from '../features/exercises/ExerciseFilters';
import ExerciseCard from '../features/exercises/ExerciseCard';
import ExerciseDetailModal from '../features/exercises/ExerciseDetailModal';
import EmptyState from '../components/EmptyState';

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

  if (loading) return <p aria-live="polite">Loading exercises...</p>;
  if (error) return <p aria-live="assertive">Error: {error}</p>;

  return (
    <div className="page-container">
      <h1>Exercise Library</h1>

      <ExerciseFilters
        exercises={exercises}
        searchValue={search}
        onSearchChange={setSearch}
        activeMuscleGroup={muscleGroup}
        onMuscleGroupChange={setMuscleGroup}
      />

      {filteredExercises.length === 0 ? (
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