import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import PlanMetaForm from '../features/workouts/PlanMetaForm';
import PlanExerciseRow from '../features/workouts/PlanExerciseRow';
import ExercisePicker from '../features/workouts/ExercisePicker';
import Button from '../components/Button';

const DEFAULT_META = {
  name: '',
  goal: 'general',
  daysPerWeek: 3,
  sessionDuration: 45,
  experienceLevel: 'beginner',
};

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
        });
        setExercises(existingPlan.exercises || []);
      }
    }
  }, [isEditMode, loading, plans, id]);

  const handleAddExercise = (exercise) => {
    setExercises((prev) => [
      ...prev,
      {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        targetSets: 3,
        targetReps: 10,
        targetWeight: 0,
        restSeconds: 60,
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

  const handleSave = async () => {
    const planData = { ...meta, exercises };
    if (isEditMode) {
      await editPlan(id, planData);
    } else {
      await addPlan(planData);
    }
    navigate('/plans');
  };

  if (isEditMode && loading) return <p aria-live="polite">Loading plan...</p>;

  return (
    <div className="page-container">
      <h1>{isEditMode ? 'Edit Plan' : 'New Plan'}</h1>

      <PlanMetaForm meta={meta} onChange={setMeta} />

      <div className="page-header">
        <h2>Exercises</h2>
        <Button variant="secondary" onClick={() => setIsPickerOpen(true)}>
          + Add Exercise
        </Button>
      </div>

      {exercises.map((entry, index) => (
        <PlanExerciseRow
          key={`${entry.exerciseId}-${index}`}
          entry={entry}
          onChange={(updated) => handleUpdateExercise(index, updated)}
          onRemove={() => handleRemoveExercise(index)}
        />
      ))}

      <Button variant="primary" onClick={handleSave} disabled={!meta.name}>
        Save Plan
      </Button>

      <ExercisePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleAddExercise}
      />
    </div>
  );
}

export default WorkoutPlanEditor;