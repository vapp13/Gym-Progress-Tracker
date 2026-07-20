import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Save } from 'lucide-react';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import PlanMetaForm from '../features/workouts/PlanMetaForm';
import PlanExerciseRow from '../features/workouts/PlanExerciseRow';
import ExercisePicker from '../features/workouts/ExercisePicker';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';

const DEFAULT_META = {
  name: '',
  goal: 'general',
  daysPerWeek: 3,
  sessionDuration: 45,
  experienceLevel: 'beginner',
  scheduledDays: [],
};

function generateEntryId() {
  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function WorkoutPlanEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { plans, loading, addPlan, editPlan } = useWorkoutPlans();
  const isEditMode = Boolean(id);

  const [meta, setMeta] = useState(DEFAULT_META);
  const [exercises, setExercises] = useState([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    if (isEditMode && !loading) {
      const existingPlan = plans.find((p) => p.id === id);
      if (existingPlan) {
        setMeta({
          name: existingPlan.name,
          goal: existingPlan.goal,
          daysPerWeek: existingPlan.daysPerWeek,
          sessionDuration: existingPlan.sessionDuration,
          experienceLevel: existingPlan.experienceLevel,
          scheduledDays: existingPlan.scheduledDays || [],
        });
        // Older plans won't have entryId — backfill so grouping/notes work.
        const withEntryIds = (existingPlan.exercises || []).map((entry) => ({
          entryId: entry.entryId || generateEntryId(),
          supersetGroupId: entry.supersetGroupId || null,
          notes: entry.notes || '',
          ...entry,
        }));
        setExercises(withEntryIds);
      }
    }
  }, [isEditMode, loading, plans, id]);

  const handleAddExercise = (exercise) => {
    setExercises((prev) => [
      ...prev,
      {
        entryId: generateEntryId(),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        targetSets: 1,
        targetReps: 10,
        targetWeight: 0,
        restSeconds: 60,
        supersetGroupId: null,
        notes: '',
        order: prev.length,
      },
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
    navigate('/plans');
  };

  if (isEditMode && loading) return <p aria-live="polite" style={{ padding: 24 }}>Loading plan...</p>;

  return (
    <div className="page-container">
      <PageHeader title={isEditMode ? 'Edit Plan' : 'New Plan'} showBack onBack={() => navigate('/plans')} />

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
            onChange={(updated) => handleUpdateExercise(index, updated)}
            onRemove={() => handleRemoveExercise(index)}
            onToggleSuperset={() => handleToggleSuperset(index)}
          />
        );
      })}

      <div style={{ marginTop: 'var(--space-lg)', display: 'flex', gap: 'var(--space-sm)' }}>
        <Button variant="secondary" onClick={() => navigate('/plans')} style={{ flex: 1 }}>
          Cancel
        </Button>
        <Button variant="primary" icon={Save} onClick={handleSave} disabled={!meta.name} style={{ flex: 1 }}>
          Save Plan
        </Button>
      </div>

      <ExercisePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleAddExercise}
      />
    </div>
  );
}

export default WorkoutPlanEditor;
