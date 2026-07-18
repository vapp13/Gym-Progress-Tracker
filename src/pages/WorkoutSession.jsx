import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import { useWorkoutSessions } from '../hooks/useWorkoutSessions';
import SessionExerciseCard from '../features/sessions/SessionExerciseCard';
import Button from '../components/Button';

function buildInitialExercises(plan) {
  return plan.exercises.map((planEx) => ({
    exerciseId: planEx.exerciseId,
    exerciseName: planEx.exerciseName,
    restSeconds: planEx.restSeconds,
    sets: Array.from({ length: planEx.targetSets }, () => ({
      reps: planEx.targetReps,
      weight: planEx.targetWeight,
      completed: false,
    })),
  }));
}

function WorkoutSession() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { plans, loading: plansLoading } = useWorkoutPlans();
  const { start, complete } = useWorkoutSessions();

  const [sessionId, setSessionId] = useState(null);
  const [exercises, setExercises] = useState([]);
  const hasStarted = useRef(false);

  useEffect(() => {
    async function initSession() {
      if (plansLoading || hasStarted.current) return;
      const plan = plans.find((p) => p.id === planId);
      if (!plan) return;

      hasStarted.current = true;
      const newSessionId = await start(planId);
      setSessionId(newSessionId);
      setExercises(buildInitialExercises(plan));
    }
    initSession();
  }, [plansLoading, plans, planId, start]);

  const handleExerciseChange = (index, updatedExercise) => {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? updatedExercise : ex))
    );
  };

  const handleFinish = async () => {
    await complete(sessionId, exercises);
    navigate('/plans');
  };

  if (plansLoading || exercises.length === 0) {
    return <p>Loading workout...</p>;
  }

  return (
    <div className="page-container">
      <h1>Workout in Progress</h1>

      {exercises.map((exercise, index) => (
        <SessionExerciseCard
          key={`${exercise.exerciseId}-${index}`}
          exercise={exercise}
          onChange={(updated) => handleExerciseChange(index, updated)}
        />
      ))}

      <Button variant="primary" onClick={handleFinish}>
        Finish Workout
      </Button>
    </div>
  );
}

export default WorkoutSession;