import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import { useWorkoutSessions } from '../hooks/useWorkoutSessions';
import SessionExerciseCard from '../features/sessions/SessionExerciseCard';
import Button from '../components/Button';
import { SkeletonCard } from '../components/Skeleton';

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
    return (
      <div className="page-container" aria-live="polite">
        <SkeletonCard />
        <div style={{ marginTop: 12 }}><SkeletonCard /></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Workout in Progress</h1>
      </div>

      {exercises.map((exercise, index) => (
        <SessionExerciseCard
          key={`${exercise.exerciseId}-${index}`}
          exercise={exercise}
          onChange={(updated) => handleExerciseChange(index, updated)}
        />
      ))}

      <Button variant="primary" icon={CheckCircle} onClick={handleFinish} style={{ width: '100%' }}>
        Finish Workout
      </Button>
    </div>
  );
}

export default WorkoutSession;
