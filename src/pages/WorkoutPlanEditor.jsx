import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Save } from 'lucide-react';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import { useExercises } from '../hooks/useExercises';
import { generateEntryId } from '../utils/generateId';
import PlanMetaForm from '../features/workouts/PlanMetaForm';
import PlanExerciseRow from '../features/workouts/PlanExerciseRow';
import ExercisePicker from '../features/workouts/ExercisePicker';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import ConfirmModal from '../components/ConfirmModal';

const DEFAULT_META = {
  name: '',
  goal: 'general',
  daysPerWeek: 3,
  sessionDuration: 45,
  experienceLevel: 'beginner',
  scheduledDays: [],
};

function WorkoutPlanEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { plans, loading, addPlan, editPlan } = useWorkoutPlans();
  const { exercises: exerciseLibrary } = useExercises();
  const isEditMode = Boolean(id);
  const templateData = location.state?.templateData;

  const [meta, setMeta] = useState(() => {
    if (templateData) {
      return {
        name: templateData.name,
        goal: templateData.goal,
        daysPerWeek: templateData.daysPerWeek,
        sessionDuration: templateData.sessionDuration,
        experienceLevel: templateData.experienceLevel,
        scheduledDays: templateData.scheduledDays || [],
      };
    }
    return DEFAULT_META;
  });
  const [exercises, setExercises] = useState(() => templateData?.exercises || []);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  // Baseline to compare against for "unsaved changes" — a template's
  // pre-filled content is real, losable data, so the baseline for a new
  // plan stays blank even when a template pre-populated the form. Edit
  // mode's baseline updates to the loaded plan once it arrives below.
  const [initialSnapshot, setInitialSnapshot] = useState(
    JSON.stringify({ meta: DEFAULT_META, exercises: [] })
  );

  useEffect(() => {
    if (isEditMode && !loading) {
      const existingPlan = plans.find((p) => p.id === id);
      if (existingPlan) {
        const loadedMeta = {
          name: existingPlan.name,
          goal: existingPlan.goal,
          daysPerWeek: existingPlan.daysPerWeek,
          sessionDuration: existingPlan.sessionDuration,
          experienceLevel: existingPlan.experienceLevel,
          scheduledDays: existingPlan.scheduledDays || [],
        };
        // Older plans won't have entryId — backfill so grouping/notes work.
        const withEntryIds = (existingPlan.exercises || []).map((entry) => ({
          entryId: entry.entryId || generateEntryId(),
          supersetGroupId: entry.supersetGroupId || null,
          notes: entry.notes || '',
          ...entry,
        }));
        setMeta(loadedMeta);
        setExercises(withEntryIds);
        setInitialSnapshot(JSON.stringify({ meta: loadedMeta, exercises: withEntryIds }));
      }
    }
  }, [isEditMode, loading, plans, id]);

  const hasUnsavedChanges = JSON.stringify({ meta, exercises }) !== initialSnapshot;

  const leaveEditor = () => navigate('/plans');

  const handleBackOrCancel = () => {
    if (hasUnsavedChanges) {
      setIsDiscardOpen(true);
    } else {
      leaveEditor();
    }
  };

  const handleAddExercises = (newExercises) => {
    setExercises((prev) => [
      ...prev,
      ...newExercises.map((exercise, i) => ({
        entryId: generateEntryId(),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        targetSets: '',
        targetReps: '',
        targetWeight: '',
        restSeconds: 60,
        supersetGroupId: null,
        notes: '',
        order: prev.length + i,
      })),
    ]);
  };

  const handleUpdateExercise = (index, updatedEntry) => {
    setExercises((prev) =>
      prev.map((entry, i) => (i === index ? updatedEntry : entry))
    );
  };

  const handleRemoveExercise = (index) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleSuperset = (index) => {
    setExercises((prev) => {
      const current = prev[index];
      const previous = prev[index - 1];
      if (!previous) return prev;

      const isLinked = current.supersetGroupId && current.supersetGroupId === previous.supersetGroupId;

      if (isLinked) {
        // Unlink: only this entry leaves the group.
        return prev.map((entry, i) => (i === index ? { ...entry, supersetGroupId: null } : entry));
      }

      const groupId = previous.supersetGroupId || previous.entryId;
      return prev.map((entry, i) => {
        if (i === index) return { ...entry, supersetGroupId: groupId };
        if (i === index - 1 && !entry.supersetGroupId) return { ...entry, supersetGroupId: groupId };
        return entry;
      });
    });
  };

  const handleSave = async () => {
    const planData = { ...meta, exercises };
    if (isEditMode) {
      await editPlan(id, planData);
    } else {
      await addPlan(planData);
    }
    leaveEditor();
  };

  // Sets/Reps start empty for a faster mobile entry experience, but
  // shouldn't be savable empty. Weight is intentionally NOT required —
  // users often plan an exercise before knowing what weight they'll use,
  // and 0 is itself a valid weight (bodyweight exercises) so it was never
  // meaningfully "validated" anyway.
  const hasIncompleteExercise = exercises.some(
    (ex) => ex.targetSets === '' || ex.targetReps === ''
  );

  if (isEditMode && loading) return <p aria-live="polite" style={{ padding: 24 }}>Loading plan...</p>;

  return (
    <div className="page-container">
      <PageHeader title={isEditMode ? 'Edit Plan' : 'New Plan'} showBack onBack={handleBackOrCancel} />

      <PlanMetaForm meta={meta} onChange={setMeta} />

      <div className="page-header">
        <h2>Exercises</h2>
        <Button variant="secondary" size="sm" icon={Plus} onClick={() => setIsPickerOpen(true)}>
          Add Exercise
        </Button>
      </div>

      {exercises.map((entry, index) => {
        const previous = exercises[index - 1];
        const isLinkedToPrevious = Boolean(
          previous && entry.supersetGroupId && entry.supersetGroupId === previous.supersetGroupId
        );
        return (
          <PlanExerciseRow
            key={entry.entryId}
            entry={entry}
            isLinkedToPrevious={isLinkedToPrevious}
            canLinkToPrevious={index > 0}
            exercises={exerciseLibrary}
            onChange={(updated) => handleUpdateExercise(index, updated)}
            onRemove={() => handleRemoveExercise(index)}
            onToggleSuperset={() => handleToggleSuperset(index)}
          />
        );
      })}

      <div style={{ marginTop: 'var(--space-lg)', display: 'flex', gap: 'var(--space-sm)' }}>
        <Button variant="secondary" onClick={handleBackOrCancel} style={{ flex: 1 }}>
          Cancel
        </Button>
        <Button variant="primary" icon={Save} onClick={handleSave} disabled={!meta.name || hasIncompleteExercise} style={{ flex: 1 }}>
          Save Plan
        </Button>
      </div>

      <ExercisePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onConfirm={handleAddExercises}
      />

      <ConfirmModal
        isOpen={isDiscardOpen}
        onClose={() => setIsDiscardOpen(false)}
        onConfirm={leaveEditor}
        title="Discard Changes"
        message="You have unsaved changes to this plan. Leaving now will discard them."
        confirmLabel="Discard"
      />
    </div>
  );
}

export default WorkoutPlanEditor;
