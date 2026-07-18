import Modal from '../../components/Modal';
import './ExerciseDetailModal.css';

function ExerciseDetailModal({ exercise, isOpen, onClose }) {
  if (!exercise) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={exercise.name}>
      <div className="exercise-detail">
        {exercise.imageUrl ? (
          <img
            src={exercise.imageUrl}
            alt={exercise.name}
            className="exercise-detail-media"
          />
        ) : (
          <div className="exercise-detail-media-placeholder">
            <span>No image yet</span>
          </div>
        )}

        <div className="exercise-detail-meta">
          <span className="exercise-detail-badge">{exercise.muscleGroup}</span>
          <span className="exercise-detail-badge">{exercise.equipment}</span>
          {exercise.difficulty && (
            <span className={`difficulty-tag difficulty-${exercise.difficulty}`}>
              {exercise.difficulty}
            </span>
          )}
        </div>

        <h4>Instructions</h4>
        <p>{exercise.instructions}</p>

        {exercise.tips && (
          <>
            <h4>Tips</h4>
            <p>{exercise.tips}</p>
          </>
        )}
      </div>
    </Modal>
  );
}

export default ExerciseDetailModal;