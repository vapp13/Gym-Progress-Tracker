import { useState } from 'react';
import { Info } from 'lucide-react';
import ExerciseDetailModal from './ExerciseDetailModal';
import { normalizeDifficulty } from '../../utils/difficulty';
import './ExerciseInfoHeader.css';

// Shared exercise name + info button + difficulty/muscle/equipment tags,
// used on both plan-exercise rows and session-exercise cards so the two
// contexts show identical exercise info instead of two designs. Takes the
// already-fetched exercise library as a prop rather than fetching itself —
// this renders once per exercise row, and each row self-fetching would
// mean re-reading the whole library N times on one page.
function ExerciseInfoHeader({ exerciseId, exerciseName, exercises, headingTag: Heading = 'h3' }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const exercise = exercises?.find((ex) => ex.id === exerciseId);
  const difficulty = exercise ? normalizeDifficulty(exercise.difficulty) : null;

  return (
    <>
      <div className="exercise-info-header-row">
        <Heading>{exerciseName}</Heading>
        {exercise && (
          <button
            type="button"
            className="exercise-info-trigger"
            onClick={() => setIsDetailOpen(true)}
            aria-label={`View ${exerciseName} details`}
          >
            <Info size={16} />
          </button>
        )}
      </div>

      {exercise && (
        <div className="exercise-info-header-tags">
          {difficulty && (
            <span className={`difficulty-tag difficulty-${difficulty}`}>{difficulty}</span>
          )}
          {exercise.muscleGroup && <span className="exercise-info-header-tag">{exercise.muscleGroup}</span>}
          {(exercise.equipmentCategory || exercise.equipment) && (
            <span className="exercise-info-header-tag">{exercise.equipmentCategory || exercise.equipment}</span>
          )}
        </div>
      )}

      <ExerciseDetailModal
        exercise={exercise}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
}

export default ExerciseInfoHeader;
