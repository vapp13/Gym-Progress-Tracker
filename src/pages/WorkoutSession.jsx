import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Pause, XCircle, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import { useWorkoutSessions } from '../hooks/useWorkoutSessions';
import { getExercisePerformanceBatch, getExercisePerformance } from '../services/exercisePerformance.service';
import { sessionRoute } from '../utils/sessionRoute';
import SessionExerciseCard from '../features/sessions/SessionExerciseCard';
import ExercisePicker from '../features/workouts/ExercisePicker';
import Button from '../components/Button';
import ConfirmModal from '../components/ConfirmModal';
import SessionTimer from '../components/SessionTimer';
import EmptyState from '../components/EmptyState';
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
    sets: Array.from({ length: 1 }, () => ({
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
  const isFreeMode = !planId;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plans, loading: plansLoading } = useWorkoutPlans();
  const { start, saveProgress, complete, pause, resume, discard, findActiveSession } = useWorkoutSessions();

  const [sessionId, setSessionId] = useState(null);
  const [sessionStartedAt, setSessionStartedAt] = useState(null);
  const [planName, setPlanName] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [notes, setNotes] = useState('');
  const [previousPerformance, setPreviousPerformance] = useState({});
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const hasInitialized = useRef(false);
  const skipNextAutosave = useRef(true);
  const autosaveTimer = useRef(null);

  useEffect(() => {
    async function initSession() {
      if (!isFreeMode && plansLoading) return;
      if (hasInitialized.current) return;

      const plan = isFreeMode ? null : plans.find((p) => p.id === planId);
      if (!isFreeMode && !plan) return;

      hasInitialized.current = true;

      const existingActive = await findActiveSession();
      const matchesThisRoute = existingActive
        ? (isFreeMode ? !existingActive.planId : existingActive.planId === planId)
        : false;

      let activeSessionId;
      let activeExercises;
      let activeNotes = '';
      let activeStartedAt;
      let activePlanName = isFreeMode ? 'Free Workout' : plan.name;

      if (existingActive && matchesThisRoute) {
        // Resume this exact workout in place.
        activeSessionId = existingActive.id;
        activeExercises = existingActive.exercises.length > 0
          ? existingActive.exercises
          : (isFreeMode ? [] : buildInitialExercises(plan));
        activeNotes = existingActive.notes || '';
        activeStartedAt = existingActive.startedAt;
        activePlanName = existingActive.planName || activePlanName;
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
          navigate(sessionRoute(existingActive), { replace: true });
        } else {
          navigate('/plans', { replace: true });
        }
        return;
      } else {
        activeSessionId = await start(isFreeMode ? null : planId, activePlanName);
        activeExercises = isFreeMode ? [] : buildInitialExercises(plan);
        activeStartedAt = { toDate: () => new Date() };
      }

      const exerciseIds = activeExercises.map((ex) => ex.exerciseId);
      const performance = exerciseIds.length > 0
        ? await getExercisePerformanceBatch(user.uid, exerciseIds)
        : {};

      skipNextAutosave.current = true;
      setSessionId(activeSessionId);
      setSessionStartedAt(activeStartedAt);
      setPlanName(activePlanName);
      setExercises(activeExercises);
      setNotes(activeNotes);
      setPreviousPerformance(performance);
    }
    initSession();
  }, [isFreeMode, plansLoading, plans, planId, start, resume, findActiveSession, user, navigate]);

  // Continuously (debounced) saves progress to Firestore as the user logs
  // sets, so closing/reopening the app resumes exactly where they left off.
  useEffect(() => {
    if (!sessionId) return;

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

  const handleAddExtraExercises = async (newExercises) => {
    setExercises((prev) => [...prev, ...newExercises.map(buildExtraExercise)]);
    // Fetch previous-performance for these too, same as the plan-provided
    // ones, so the "Previous: ..." prompt still works.
    const toFetch = newExercises.filter((ex) => !previousPerformance[ex.id]);
    if (toFetch.length === 0) return;

    const results = await Promise.all(
      toFetch.map((ex) => getExercisePerformance(user.uid, ex.id))
    );
    setPreviousPerformance((prev) => {
      const updated = { ...prev };
      toFetch.forEach((ex, i) => {
        if (results[i]) updated[ex.id] = results[i];
      });
      return updated;
    });
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

  const handleConfirmDiscard = async () => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    await discard(sessionId);
    navigate('/plans');
  };

  if ((!isFreeMode && plansLoading) || !sessionId) {
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h1>{isFreeMode ? 'Free Workout' : planName}</h1>
          <SessionTimer startedAt={sessionStartedAt} />
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          <button className="session-icon-btn" onClick={handlePause} aria-label="Pause workout">
            <Pause size={18} />
          </button>
          <button className="session-icon-btn session-icon-btn-danger" onClick={() => setIsDiscardOpen(true)} aria-label="Discard workout">
            <XCircle size={18} />
          </button>
        </div>
      </div>

      {exercises.length === 0 ? (
        <EmptyState message="Add your first exercise to get started." />
      ) : (
        exercises.map((exercise, index) => {
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
        })
      )}

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

      <Button
        variant="primary"
        icon={CheckCircle}
        onClick={handleFinish}
        disabled={exercises.length === 0}
        style={{ width: '100%' }}
      >
        Finish Workout
      </Button>

      <ExercisePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onConfirm={handleAddExtraExercises}
      />

      <ConfirmModal
        isOpen={isDiscardOpen}
        onClose={() => setIsDiscardOpen(false)}
        onConfirm={handleConfirmDiscard}
        title="Discard Workout"
        message="Discard this workout? Logged sets will not be saved to your history."
        confirmLabel="Discard"
      />
    </div>
  );
}

export default WorkoutSession;
