import { useState } from 'react';
import { getExerciseImagePaths } from '../../utils/exerciseImage';

// Most exercises don't have images yet (400+ in the library, images added
// incrementally), so each half needs to fail silently — no broken-image
// icon — when the file doesn't exist rather than being pre-declared.
function ExerciseImages({ exerciseName }) {
  const { movementUrl, musclesUrl } = getExerciseImagePaths(exerciseName);
  const [movementFailed, setMovementFailed] = useState(false);
  const [musclesFailed, setMusclesFailed] = useState(false);

  if (movementFailed && musclesFailed) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
      {!movementFailed && (
        <img
          src={movementUrl}
          alt={`${exerciseName} movement breakdown`}
          style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
          loading="lazy"
          onError={() => setMovementFailed(true)}
        />
      )}
      {!musclesFailed && (
        <img
          src={musclesUrl}
          alt={`${exerciseName} muscles worked`}
          style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
          loading="lazy"
          onError={() => setMusclesFailed(true)}
        />
      )}
    </div>
  );
}

export default ExerciseImages;
