import { useState } from 'react';
import Modal from '../../components/Modal';
import EmptyState from '../../components/EmptyState';
import { useExercises } from '../../hooks/useExercises';
import { PLAN_TEMPLATES } from '../../data/planTemplates';
import { generateEntryId } from '../../utils/generateId';
import { findMatchingExercise } from '../../utils/exerciseMatching';
import '../exercises/BodySectionFilterModal.css';

// Matches template exercise names against the user's actual library —
// templates reference exercises by name since IDs vary per deployment.
// Exercises with no match are simply skipped rather than blocking the
// whole template. "Warm Up" is a real library exercise like any other,
// so it goes through the same matching (this also means it correctly
// gets its info icon/tags once applied to a plan).
function buildPlanFromTemplate(template, availableExercises) {
  const exercises = template.exercises
    .map((templateEx, index) => {
      const match = findMatchingExercise(templateEx.name, availableExercises);
      if (!match) return null;

      return {
        entryId: generateEntryId(),
        exerciseId: match.id,
        exerciseName: match.name,
        targetSets: templateEx.sets,
        targetReps: templateEx.reps === '' || templateEx.reps === undefined ? '' : Number(templateEx.reps),
        targetWeight: '',
        restSeconds: 60,
        supersetGroupId: null,
        notes: templateEx.notes || '',
        order: index,
      };
    })
    .filter(Boolean);

  const skippedCount = template.exercises.length - exercises.length;

  return {
    planData: {
      name: template.name,
      goal: template.goal,
      daysPerWeek: template.daysPerWeek,
      sessionDuration: 45,
      experienceLevel: 'beginner',
      scheduledDays: [],
      exercises,
    },
    skippedCount,
  };
}

function PlanTemplatesModal({ isOpen, onClose, onUseTemplate }) {
  const { exercises, loading } = useExercises();
  const [pendingTemplate, setPendingTemplate] = useState(null);

  const handleSelect = (template) => {
    const { planData, skippedCount } = buildPlanFromTemplate(template, exercises);

    if (planData.exercises.length === 0) {
      setPendingTemplate({ template, error: true });
      return;
    }

    onUseTemplate(planData, skippedCount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose a Template">
      {loading ? (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Loading exercises...</p>
      ) : (
        <>
          <p style={{ margin: '0 0 var(--space-md) 0', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
            Starts you off with a proven structure — sets and reps are pre-filled, weight is up to you.
          </p>
          <div className="body-section-list">
            {PLAN_TEMPLATES.map((template) => (
              <button
                key={template.id}
                className="body-section-option"
                onClick={() => handleSelect(template)}
              >
                {template.name}
              </button>
            ))}
          </div>

          {pendingTemplate?.error && (
            <div style={{ marginTop: 'var(--space-md)' }}>
              <EmptyState message="None of this template's exercises were found in your library yet." />
            </div>
          )}
        </>
      )}
    </Modal>
  );
}

export default PlanTemplatesModal;
