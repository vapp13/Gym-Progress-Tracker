import { useState } from 'react';
import SetRow from './SetRow';
import RestTimer from './RestTimer';
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
    </div>
  );
}

export default SessionExerciseCard;
