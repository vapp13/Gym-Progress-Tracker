import { useState } from 'react';
import { Plus } from 'lucide-react';
import SetRow from './SetRow';
import RestTimer from './RestTimer';
import Button from '../../components/Button';
import './SessionExerciseCard.css';

function formatPreviousSets(sets) {
  return sets.map((s) => `${s.weight}kg × ${s.reps}`).join(', ');
}

function SessionExerciseCard({ exercise, previous, onChange }) {
  const [restingAfterIndex, setRestingAfterIndex] = useState(null);

  const handleSetChange = (setIndex, updatedSet) => {
    const wasCompleted = exercise.sets[setIndex].completed;
    const updatedSets = exercise.sets.map((set, i) =>
      i === setIndex ? updatedSet : set
    );
    onChange({ ...exercise, sets: updatedSets });

    const isLastSet = setIndex === exercise.sets.length - 1;
    if (!wasCompleted && updatedSet.completed && !isLastSet) {
      setRestingAfterIndex(setIndex);
    }
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
    if (restingAfterIndex === setIndex) setRestingAfterIndex(null);
  };

  return (
    <div className="session-exercise-card">
      <h3>{exercise.exerciseName}</h3>

      {previous?.sets?.length > 0 && (
        <p className="session-exercise-previous">
          <span>Previous:</span> {formatPreviousSets(previous.sets)}
        </p>
      )}

      {exercise.sets.map((set, index) => (
        <div key={index}>
          <SetRow
            setNumber={index + 1}
            set={set}
            onChange={(updated) => handleSetChange(index, updated)}
            onRemove={() => handleRemoveSet(index)}
            canRemove={exercise.sets.length > 1}
          />
          {restingAfterIndex === index && (
            <RestTimer
              seconds={exercise.restSeconds}
              onComplete={() => setRestingAfterIndex(null)}
              onSkip={() => setRestingAfterIndex(null)}
            />
          )}
        </div>
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
