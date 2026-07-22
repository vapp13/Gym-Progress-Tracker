import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useExercises } from '../../hooks/useExercises';
import Modal from '../../components/Modal';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import '../exercises/BodySectionFilterModal.css';

function ExerciseSelector({ value, onChange, logs }) {
  const { exercises, loading } = useExercises();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Only exercises the user has actually logged sets for — out of 400+
  // exercises, most have no history yet and just add noise.
  const loggedExerciseIds = useMemo(() => new Set(logs.map((log) => log.exerciseId)), [logs]);

  const availableExercises = useMemo(() => {
    return exercises
      .filter((ex) => loggedExerciseIds.has(ex.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [exercises, loggedExerciseIds]);

  const filteredExercises = availableExercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedExercise = availableExercises.find((ex) => ex.id === value);

  const handleSelect = (exerciseId) => {
    onChange(exerciseId);
    setSearch('');
    setIsOpen(false);
  };

  if (loading) return <p aria-live="polite">Loading exercises...</p>;

  return (
    <>
      <button
        type="button"
        className="set-row-type-trigger"
        onClick={() => setIsOpen(true)}
        disabled={availableExercises.length === 0}
      >
        <span style={{ flex: 1, textAlign: 'left' }}>
          {selectedExercise?.name || (availableExercises.length === 0 ? 'No exercise history yet' : 'Select an exercise')}
        </span>
        <ChevronDown size={16} />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Select Exercise">
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search exercises..." />
        </div>
        {filteredExercises.length === 0 ? (
          <EmptyState message="No exercises match your search." />
        ) : (
          <div className="body-section-list">
            {filteredExercises.map((ex) => (
              <button
                key={ex.id}
                className={`body-section-option ${value === ex.id ? 'is-selected' : ''}`}
                onClick={() => handleSelect(ex.id)}
              >
                {ex.name}
              </button>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}

export default ExerciseSelector;
