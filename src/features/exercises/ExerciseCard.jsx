import { Dumbbell, Check } from 'lucide-react';
import { normalizeDifficulty } from '../../utils/difficulty';
import './ExerciseCard.css';

function ExerciseCard({ exercise, onClick, selectable, selected }) {
  const difficulty = normalizeDifficulty(exercise.difficulty);

  return (
    <button className={`exercise-card ${selected ? 'is-selected' : ''}`} onClick={onClick}>
      {selectable ? (
        <span className={`exercise-card-checkbox ${selected ? 'is-checked' : ''}`}>
          {selected && <Check size={14} />}
        </span>
      ) : (
        <span className="exercise-card-icon"><Dumbbell size={18} /></span>
      )}
      <div className="exercise-card-main">
        <h3>{exercise.name}</h3>
        <p className="exercise-card-meta">
          {exercise.muscleGroup} · {exercise.equipmentCategory || exercise.equipment}
        </p>
      </div>
      {difficulty && (
        <span className={`difficulty-tag difficulty-${difficulty}`}>
          {difficulty}
        </span>
      )}
    </button>
  );
}

export default ExerciseCard;
