import './ExerciseCard.css';

function ExerciseCard({ exercise, onClick }) {
  return (
    <button className="exercise-card" onClick={onClick}>
      <div className="exercise-card-main">
        <h3>{exercise.name}</h3>
        <p className="exercise-card-meta">
          {exercise.muscleGroup} · {exercise.equipment}
        </p>
      </div>
      {exercise.difficulty && (
        <span className={`difficulty-tag difficulty-${exercise.difficulty}`}>
          {exercise.difficulty}
        </span>
      )}
    </button>
  );
}

export default ExerciseCard;