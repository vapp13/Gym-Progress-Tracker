import { useState, useMemo } from 'react';
import { useExercises } from '../../hooks/useExercises';
import Modal from '../../components/Modal';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import Skeleton from '../../components/Skeleton';
import './ExercisePicker.css';

function ExercisePicker({ isOpen, onClose, onSelect }) {
  const { exercises, loading } = useExercises();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return exercises.filter((ex) =>
      ex.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [exercises, search]);

  const handleSelect = (exercise) => {
    onSelect(exercise);
    setSearch('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Exercise">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search exercises..."
      />
      <div className="exercise-picker-list">
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {[1, 2, 3].map((i) => <Skeleton key={i} height="48px" radius="var(--radius-md)" />)}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <EmptyState message="No exercises match your search." />
        )}
        {filtered.map((exercise) => (
          <button
            key={exercise.id}
            className="exercise-picker-item"
            onClick={() => handleSelect(exercise)}
          >
            <span>{exercise.name}</span>
            <span className="exercise-picker-item-meta">{exercise.muscleGroup}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}

export default ExercisePicker;
