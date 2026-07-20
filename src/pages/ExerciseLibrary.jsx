import { useState, useMemo } from 'react';
import { useExercises } from '../hooks/useExercises';
import ExerciseFilters from '../features/exercises/ExerciseFilters';
import ExerciseCard from '../features/exercises/ExerciseCard';
import ExerciseDetailModal from '../features/exercises/ExerciseDetailModal';
import AdvancedFilterModal from '../features/exercises/AdvancedFilterModal';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import { toArray } from '../utils/textFormatting';
import { normalizeDifficulty } from '../utils/difficulty';

const DEFAULT_ADVANCED_FILTERS = { muscleGroupMain: null, muscleGroupSupport: null, difficulty: null };

function ExerciseLibrary() {
  const { exercises, loading, error } = useExercises();
  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState(null);
  const [advancedFilters, setAdvancedFilters] = useState(DEFAULT_ADVANCED_FILTERS);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const hasActiveAdvancedFilters = Boolean(
    advancedFilters.muscleGroupMain || advancedFilters.muscleGroupSupport || advancedFilters.difficulty
  );

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
      const matchesGroup = !muscleGroup || ex.muscleGroup === muscleGroup;
      const matchesMain = !advancedFilters.muscleGroupMain || toArray(ex.muscleGroupMain).includes(advancedFilters.muscleGroupMain);
      const matchesSupport = !advancedFilters.muscleGroupSupport || toArray(ex.muscleGroupSupport).includes(advancedFilters.muscleGroupSupport);
      const matchesDifficulty = !advancedFilters.difficulty || normalizeDifficulty(ex.difficulty) === advancedFilters.difficulty;
      return matchesSearch && matchesGroup && matchesMain && matchesSupport && matchesDifficulty;
    });
  }, [exercises, search, muscleGroup, advancedFilters]);

  if (error) return <p aria-live="assertive">Error: {error}</p>;

  return (
    <div className="page-container">
      <PageHeader title="Exercises" showBack sticky />

      <ExerciseFilters
        exercises={exercises}
        searchValue={search}
        onSearchChange={setSearch}
        activeMuscleGroup={muscleGroup}
        onMuscleGroupChange={setMuscleGroup}
        onOpenAdvanced={() => setIsAdvancedOpen(true)}
        hasActiveAdvancedFilters={hasActiveAdvancedFilters}
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

      <AdvancedFilterModal
        isOpen={isAdvancedOpen}
        onClose={() => setIsAdvancedOpen(false)}
        exercises={exercises}
        filters={advancedFilters}
        onChange={setAdvancedFilters}
      />
    </div>
  );
}

export default ExerciseLibrary;
