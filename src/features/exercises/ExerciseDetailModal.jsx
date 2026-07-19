import Modal from '../../components/Modal';
import { splitNumberedSteps, toArray } from '../../utils/textFormatting';
import './ExerciseDetailModal.css';

function ExerciseDetailModal({ exercise, isOpen, onClose }) {
  if (!exercise) return null;

  const steps = splitNumberedSteps(exercise.instructions);
  const isNumbered = steps.length > 1;
  const mainMuscles = toArray(exercise.muscleGroupMain);
  const supportMuscles = toArray(exercise.muscleGroupSupport);

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

        {(mainMuscles.length > 0 || supportMuscles.length > 0) && (
          <div className="exercise-detail-muscles">
            {mainMuscles.length > 0 && (
              <div className="muscle-group-row">
                <span className="muscle-group-label">Main Muscles</span>
                <div className="muscle-group-tags">
                  {mainMuscles.map((muscle) => (
                    <span key={muscle} className="muscle-tag muscle-tag-main">{muscle}</span>
                  ))}
                </div>
              </div>
            )}
            {supportMuscles.length > 0 && (
              <div className="muscle-group-row">
                <span className="muscle-group-label">Supporting Muscles</span>
                <div className="muscle-group-tags">
                  {supportMuscles.map((muscle) => (
                    <span key={muscle} className="muscle-tag muscle-tag-support">{muscle}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <h4>Instructions</h4>
        {isNumbered ? (
          <ol className="instruction-list">
            {steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        ) : (
          <p>{exercise.instructions}</p>
        )}

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
