import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import ExerciseImageCarousel from './ExerciseImageCarousel';
import { splitNumberedSteps, toArray } from '../../utils/textFormatting';
import { normalizeDifficulty } from '../../utils/difficulty';
import './ExerciseDetailModal.css';

function ExerciseDetailModal({ exercise, isOpen, onClose }) {
  const navigate = useNavigate();
  if (!exercise) return null;

  const steps = splitNumberedSteps(exercise.instructions);
  const isNumbered = steps.length > 1;
  const mainMuscles = toArray(exercise.muscleGroupMain);
  const supportMuscles = toArray(exercise.muscleGroupSupport);
  const difficulty = normalizeDifficulty(exercise.difficulty);

  const handleViewHistory = () => {
    onClose();
    navigate(`/exercises/${exercise.id}/history`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={exercise.name}>
      <div className="exercise-detail">
        <ExerciseImageCarousel key={exercise.id} imageId={exercise.imageId} />

        <div className="exercise-detail-meta">
          <span className="exercise-detail-badge">{exercise.muscleGroup}</span>
          <span className="exercise-detail-badge">{exercise.equipment}</span>
          {difficulty && (
            <span className={`difficulty-tag difficulty-${difficulty}`}>
              {difficulty}
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

        <Button
          variant="secondary"
          icon={TrendingUp}
          onClick={handleViewHistory}
          style={{ width: '100%', marginTop: 'var(--space-md)' }}
        >
          View History
        </Button>
      </div>
    </Modal>
  );
}

export default ExerciseDetailModal;
