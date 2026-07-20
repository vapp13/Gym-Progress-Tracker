import { Dumbbell } from 'lucide-react';
import { normalizeDifficulty } from '../../utils/difficulty';
import './ExerciseCard.css';

function ExerciseCard({ exercise, onClick }) {
  const difficulty = normalizeDifficulty(exercise.difficulty);

  return (
    <button className="exercise-card" onClick={onClick}>
      <span className="exercise-card-icon"><Dumbbell size={18} /></span>
      <div className="exercise-card-main">
        <h3>{exercise.name}</h3>
        <p className="exercise-card-meta">
          {exercise.muscleGroup} · {exercise.equipment}
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
