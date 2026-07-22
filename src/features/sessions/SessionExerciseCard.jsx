import { Plus, Trash2 } from 'lucide-react';
import SetRow from './SetRow';
import Button from '../../components/Button';
import ExerciseInfoHeader from '../exercises/ExerciseInfoHeader';
import './SessionExerciseCard.css';

function formatPreviousSets(sets) {
  return sets.map((s) => `${s.weight}kg × ${s.reps}`).join(', ');
}

function SessionExerciseCard({ exercise, previous, exercises, onChange, onRemoveExercise }) {
  const handleSetChange = (setIndex, updatedSet) => {
    const updatedSets = exercise.sets.map((set, i) =>
      i === setIndex ? updatedSet : set
    );
    onChange({ ...exercise, sets: updatedSets });
  };

  const handleAddSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet = {
      reps: lastSet?.reps ?? '',
      weight: lastSet?.weight ?? '',
      type: 'working',
      notes: '',
      completed: false,
      completedAt: null,
    };
    onChange({ ...exercise, sets: [...exercise.sets, newSet] });
  };

  const handleRemoveSet = (setIndex) => {
    if (exercise.sets.length <= 1) return;
    const updatedSets = exercise.sets.filter((_, i) => i !== setIndex);
    onChange({ ...exercise, sets: updatedSets });
  };

  return (
    <div className="session-exercise-card">
      <div className="session-exercise-card-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          <ExerciseInfoHeader
            exerciseId={exercise.exerciseId}
            exerciseName={exercise.exerciseName}
            exercises={exercises}
            headingTag="h3"
          />
        </div>
        {onRemoveExercise && (
          <button
            className="session-exercise-card-remove"
            onClick={onRemoveExercise}
            aria-label={`Remove ${exercise.exerciseName}`}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {previous?.sets?.length > 0 && (
        <p className="session-exercise-previous">
          <span>Previous:</span> {formatPreviousSets(previous.sets)}
        </p>
      )}

      {exercise.sets.map((set, index) => (
        <SetRow
          key={index}
          setNumber={index + 1}
          set={set}
          onChange={(updated) => handleSetChange(index, updated)}
          onRemove={() => handleRemoveSet(index)}
          canRemove={exercise.sets.length > 1}
        />
      ))}

      <Button
        variant="secondary"
        size="sm"
        icon={Plus}
        onClick={handleAddSet}
        style={{ width: '100%', marginTop: 'var(--space-xs)' }}
      >
        Add Set
      </Button>
    </div>
  );
}

export default SessionExerciseCard;
