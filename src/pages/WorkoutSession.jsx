import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Pause, XCircle, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import { useWorkoutSessions } from '../hooks/useWorkoutSessions';
import { getExercisePerformanceBatch, getExercisePerformance } from '../services/exercisePerformance.service';
import SessionExerciseCard from '../features/sessions/SessionExerciseCard';
import ExercisePicker from '../features/workouts/ExercisePicker';
import Button from '../components/Button';
import { SkeletonCard } from '../components/Skeleton';

function buildInitialExercises(plan) {
  return plan.exercises.map((planEx) => ({
    exerciseId: planEx.exerciseId,
    exerciseName: planEx.exerciseName,
    restSeconds: planEx.restSeconds,
    supersetGroupId: planEx.supersetGroupId || null,
    planNotes: planEx.notes || '',
    addedExtra: false,
    sets: Array.from({ length: planEx.targetSets }, () => ({
      reps: planEx.targetReps,
      weight: planEx.targetWeight,
      type: 'working',
      rpe: null,
      notes: '',
      completed: false,
      completedAt: null,
    })),
  }));
}

function buildExtraExercise(exercise) {
  return {
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    restSeconds: 60,
    supersetGroupId: null,
    planNotes: '',
    addedExtra: true,
    sets: Array.from({ length: 3 }, () => ({
      reps: 10,
      weight: 0,
      type: 'working',
      rpe: null,
      notes: '',
      completed: false,
      completedAt: null,
    })),
  };
}

const AUTOSAVE_DELAY_MS = 1200;

function WorkoutSession() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plans, loading: plansLoading } = useWorkoutPlans();
  const { start, saveProgress, complete, pause, resume, discard, findActiveSession } = useWorkoutSessions();

  const [sessionId, setSessionId] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [notes, setNotes] = useState('');
  const [previousPerformance, setPreviousPerformance] = useState({});
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const hasInitialized = useRef(false);
  const skipNextAutosave = useRef(true);
  const autosaveTimer = useRef(null);

  useEffect(() => {
    async function initSession() {
      if (plansLoading || hasInitialized.current) return;
      const plan = plans.find((p) => p.id === planId);
      if (!plan) return;

      hasInitialized.current = true;

      const existingActive = await findActiveSession();

      let activeSessionId;
      let activeExercises;
      let activeNotes = '';

      if (existingActive && existingActive.planId === planId) {
        // Resume this exact workout in place.
        activeSessionId = existingActive.id;
        activeExercises = existingActive.exercises.length > 0
          ? existingActive.exercises
          : buildInitialExercises(plan);
        activeNotes = existingActive.notes || '';
        if (existingActive.status === 'paused') {
          await resume(activeSessionId);
        }
      } else if (existingActive) {
        // A different workout is already active — don't silently start a
        // second one. Let the user choose which one they actually want.
        const shouldResumeOther = window.confirm(
          "You have another workout already in progress. Resume that one instead?"
        );
        if (shouldResumeOther) {
          navigate(`/plans/${existingActive.planId}/session`, { replace: true });
        } else {
          navigate('/plans', { replace: true });
        }
        return;
      } else {
        activeSessionId = await start(planId, plan.name);
        activeExercises = buildInitialExercises(plan);
      }

      const exerciseIds = activeExercises.map((ex) => ex.exerciseId);
      const performance = await getExercisePerformanceBatch(user.uid, exerciseIds);

      skipNextAutosave.current = true;
      setSessionId(activeSessionId);
      setExercises(activeExercises);
      setNotes(activeNotes);
      setPreviousPerformance(performance);
    }
    initSession();
  }, [plansLoading, plans, planId, start, resume, findActiveSession, user, navigate]);

  // Continuously (debounced) saves progress to Firestore as the user logs
  // sets, so closing/reopening the app resumes exactly where they left off.
  useEffect(() => {
    if (!sessionId || exercises.length === 0) return;

    if (skipNextAutosave.current) {
      skipNextAutosave.current = false;
      return;
    }

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      saveProgress(sessionId, { exercises, notes });
    }, AUTOSAVE_DELAY_MS);

    return () => clearTimeout(autosaveTimer.current);
  }, [exercises, notes, sessionId, saveProgress]);

  const handleExerciseChange = (index, updatedExercise) => {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? updatedExercise : ex))
    );
  };

  const handleAddExtraExercise = async (exercise) => {
    setExercises((prev) => [...prev, buildExtraExercise(exercise)]);
    // Fetch previous-performance for this exercise too, same as the
    // plan-provided ones, so the "Previous: ..." prompt still works.
    if (!previousPerformance[exercise.id]) {
      const performance = await getExercisePerformance(user.uid, exercise.id);
      if (performance) {
        setPreviousPerformance((prev) => ({ ...prev, [exercise.id]: performance }));
      }
    }
  };

  const flushPendingSave = async () => {
    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
      await saveProgress(sessionId, { exercises, notes });
    }
  };

  const handleFinish = async () => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    await complete(sessionId, exercises, notes);
    navigate('/plans');
  };

  const handlePause = async () => {
    await flushPendingSave();
    await pause(sessionId);
    navigate('/plans');
  };

  const handleDiscard = async () => {
    if (!window.confirm('Discard this workout? Logged sets will not be saved to your history.')) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    await discard(sessionId);
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
        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          <button className="session-icon-btn" onClick={handlePause} aria-label="Pause workout">
            <Pause size={18} />
          </button>
          <button className="session-icon-btn session-icon-btn-danger" onClick={handleDiscard} aria-label="Discard workout">
            <XCircle size={18} />
          </button>
        </div>
      </div>

      {exercises.map((exercise, index) => {
        const previous = exercises[index - 1];
        const isLinkedToPrevious = Boolean(
          previous && exercise.supersetGroupId && exercise.supersetGroupId === previous.supersetGroupId
        );
        return (
          <div
            key={`${exercise.exerciseId}-${index}`}
            className={isLinkedToPrevious ? 'session-superset-linked' : undefined}
          >
            {exercise.supersetGroupId && !isLinkedToPrevious && (
              <p className="session-superset-label">Superset</p>
            )}
            {exercise.addedExtra && (
              <p className="session-superset-label" style={{ color: 'var(--color-primary)' }}>Added</p>
            )}
            {exercise.planNotes && (
              <p className="session-exercise-plan-notes">{exercise.planNotes}</p>
            )}
            <SessionExerciseCard
              exercise={exercise}
              previous={previousPerformance[exercise.exerciseId]}
              onChange={(updated) => handleExerciseChange(index, updated)}
            />
          </div>
        );
      })}

      <Button
        variant="secondary"
        icon={Plus}
        onClick={() => setIsPickerOpen(true)}
        style={{ width: '100%', marginBottom: 'var(--space-md)' }}
      >
        Add Exercise
      </Button>

      <label className="form-field" style={{ marginBottom: 'var(--space-md)' }}>
        <span>Workout notes (optional)</span>
        <input
          type="text"
          placeholder="How did it feel?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>

      <Button variant="primary" icon={CheckCircle} onClick={handleFinish} style={{ width: '100%' }}>
        Finish Workout
      </Button>

      <ExercisePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleAddExtraExercise}
      />
    </div>
  );
}

export default WorkoutSession;
