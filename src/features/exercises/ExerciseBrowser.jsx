import { useState, useMemo } from 'react';
import { useExercises } from '../../hooks/useExercises';
import ExerciseFilters from './ExerciseFilters';
import ExerciseCard from './ExerciseCard';
import ExerciseDetailModal from './ExerciseDetailModal';
import AdvancedFilterModal from './AdvancedFilterModal';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import Skeleton from '../../components/Skeleton';
import { DEFAULT_FILTERS, matchesFilters } from '../../utils/exerciseFilters';
import './ExerciseBrowser.css';

// Shared exercise browsing engine — used identically by the main Exercise
// Library page and by the exercise picker (workout plans + free workout),
// so filtering/search/cards only exist in one place. `selectionMode`
// switches tap-to-view-details into tap-to-toggle-selection with a fixed
// "Add X Exercises" confirm bar.
function ExerciseBrowser({ selectionMode = false, onConfirmSelection }) {
  const { exercises, loading, error } = useExercises();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const hasActiveAdvancedFilters = Boolean(
    filters.muscleGroupMain || filters.muscleGroupSupport || filters.difficulty
  );

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => matchesFilters(ex, search, filters));
  }, [exercises, search, filters]);

  const toggleSelection = (exerciseId) => {
    setSelectedIds((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]
    );
  };

  const handleCardClick = (exercise) => {
    if (selectionMode) {
      toggleSelection(exercise.id);
    } else {
      setSelectedExercise(exercise);
    }
  };

  const handleConfirm = () => {
    const selected = exercises.filter((ex) => selectedIds.includes(ex.id));
    onConfirmSelection(selected);
  };

  if (error) return <p aria-live="assertive">Error: {error}</p>;

  return (
    <div className="exercise-browser">
      <ExerciseFilters
        exercises={exercises}
        searchValue={search}
        onSearchChange={setSearch}
        filters={filters}
        onFiltersChange={setFilters}
        onOpenAdvanced={() => setIsAdvancedOpen(true)}
        hasActiveAdvancedFilters={hasActiveAdvancedFilters}
      />

      <div className="section-title" style={{ marginTop: 0 }}>All Exercises</div>

      {loading ? (
        <div aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height="66px" radius="var(--radius-lg)" />
          ))}
        </div>
      ) : filteredExercises.length === 0 ? (
        <EmptyState message="No exercises match your filters." />
      ) : (
        <div className={selectionMode ? 'exercise-browser-list-with-bar' : undefined}>
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onClick={() => handleCardClick(exercise)}
              selectable={selectionMode}
              selected={selectionMode && selectedIds.includes(exercise.id)}
            />
          ))}
        </div>
      )}

      {!selectionMode && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      <AdvancedFilterModal
        isOpen={isAdvancedOpen}
        onClose={() => setIsAdvancedOpen(false)}
        exercises={exercises}
        filters={filters}
        onChange={setFilters}
      />

      {selectionMode && selectedIds.length > 0 && (
        <div className="exercise-browser-confirm-bar">
          <Button variant="primary" onClick={handleConfirm} style={{ width: '100%' }}>
            Add {selectedIds.length} Exercise{selectedIds.length !== 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ExerciseBrowser;
