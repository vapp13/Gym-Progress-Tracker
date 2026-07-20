import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useMeasurements } from '../hooks/useMeasurements';
import { useProgressLogs } from '../hooks/useProgressLogs';
import { useGoals } from '../hooks/useGoals';
import { useUserProfile } from '../hooks/useUserProfile';
import { usePersonalRecords } from '../hooks/usePersonalRecords';
import ProgressSummaryCards from '../features/progress/ProgressSummaryCards';
import MeasurementSelector from '../features/progress/MeasurementSelector';
import MeasurementChart from '../features/progress/MeasurementChart';
import MeasurementForm from '../features/progress/MeasurementForm';
import MeasurementHistoryList from '../features/progress/MeasurementHistoryList';
import EditMeasurementModal from '../features/progress/EditMeasurementModal';
import ExerciseSelector from '../features/progress/ExerciseSelector';
import ExerciseProgressStats from '../features/progress/ExerciseProgressStats';
import ExerciseProgressChart from '../features/progress/ExerciseProgressChart';
import ProgressPersonalRecords from '../features/progress/ProgressPersonalRecords';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import Button from '../components/Button';
import { SkeletonCard } from '../components/Skeleton';
import { getMeasurementField } from '../utils/measurementFields';

const WEIGHT_GOAL_TYPES = ['weight', 'lose-weight', 'gain-weight', 'maintain-weight'];

function getWeightGoalTarget(goal) {
  if (!goal) return undefined;
  return goal.metrics ? goal.metrics.target : goal.targetValue;
}

function Progress() {
  const { measurements, loading: measurementsLoading, addEntry, editEntry, removeEntry } = useMeasurements();
  const { logs, loading: logsLoading } = useProgressLogs();
  const { goals, loading: goalsLoading } = useGoals();
  const { data: profile, loading: profileLoading } = useUserProfile();
  const { records: personalRecords, loading: recordsLoading } = usePersonalRecords();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState('weight');
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const units = profile?.preferences?.units || 'metric';
  const activeGoal = goals.find((g) => g.isActive);
  const activeWeightGoal = goals.find((g) => g.isActive && WEIGHT_GOAL_TYPES.includes(g.type));
  const selectedField = getMeasurementField(selectedMeasurement);

  const isLoading = measurementsLoading || goalsLoading || profileLoading;

  const handleSaveMeasurement = async (data) => {
    await addEntry(data);
    setIsModalOpen(false);
  };

  const handleSaveEdit = async (entryId, updates) => {
    await editEntry(entryId, updates);
    setEditingEntry(null);
  };

  const handleConfirmDelete = () => {
    if (pendingDelete) removeEntry(pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <div className="page-container">
      <PageHeader title="Progress" showBack sticky />

      {isLoading ? (
        <SkeletonCard />
      ) : (
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <ProgressSummaryCards measurements={measurements} activeGoal={activeGoal} units={units} />
        </div>
      )}

      <div className="page-header">
        <h2>Body Measurements</h2>
        <Button variant="secondary" size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add
        </Button>
      </div>

      {isLoading ? (
        <SkeletonCard />
      ) : (
        <>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <MeasurementSelector
              value={selectedMeasurement}
              onChange={setSelectedMeasurement}
              measurements={measurements}
            />
          </div>
          <MeasurementChart
            measurements={measurements}
            fieldKey={selectedMeasurement}
            units={units}
            targetWeight={getWeightGoalTarget(activeWeightGoal)}
          />

          <button
            className="todays-workout-change"
            onClick={() => setShowHistory((prev) => !prev)}
            style={{ marginTop: 'var(--space-sm)' }}
          >
            {showHistory ? 'Hide' : 'View'} {selectedField?.label} history
          </button>

          {showHistory && (
            <div style={{ marginTop: 'var(--space-sm)' }}>
              <MeasurementHistoryList
                measurements={measurements}
                field={selectedField}
                units={units}
                onEdit={setEditingEntry}
                onDelete={setPendingDelete}
              />
            </div>
          )}
        </>
      )}

      <div className="section-title">Exercise Progress</div>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <ExerciseSelector value={selectedExerciseId} onChange={setSelectedExerciseId} />
      </div>
      {logsLoading || recordsLoading ? (
        <SkeletonCard />
      ) : (
        <>
          {selectedExerciseId && (
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <ExerciseProgressStats logs={logs} exerciseId={selectedExerciseId} records={personalRecords} />
            </div>
          )}
          <ExerciseProgressChart logs={logs} exerciseId={selectedExerciseId} />
        </>
      )}

      <div className="section-title">Personal Records</div>
      <ProgressPersonalRecords />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Measurement"
      >
        <MeasurementForm
          onSave={handleSaveMeasurement}
          onCancel={() => setIsModalOpen(false)}
          units={units}
        />
      </Modal>

      <EditMeasurementModal
        isOpen={Boolean(editingEntry)}
        onClose={() => setEditingEntry(null)}
        entry={editingEntry}
        field={selectedField}
        units={units}
        onSave={handleSaveEdit}
      />

      <ConfirmModal
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Measurement"
        message="Delete this measurement entry? This will update all related graphs, summaries, and goal progress calculations, and can't be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}

export default Progress;
