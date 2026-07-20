import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useMeasurements } from '../hooks/useMeasurements';
import { useProgressLogs } from '../hooks/useProgressLogs';
import { useGoals } from '../hooks/useGoals';
import BodyWeightChart from '../features/progress/BodyWeightChart';
import MeasurementForm from '../features/progress/MeasurementForm';
import ExerciseSelector from '../features/progress/ExerciseSelector';
import ExerciseProgressChart from '../features/progress/ExerciseProgressChart';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { SkeletonCard } from '../components/Skeleton';

const WEIGHT_GOAL_TYPES = ['weight', 'lose-weight', 'gain-weight', 'maintain-weight'];

function getWeightGoalTarget(goal) {
  if (!goal) return undefined;
  return goal.metrics ? goal.metrics.target : goal.targetValue;
}

function Progress() {
  const { measurements, loading: measurementsLoading, addEntry } = useMeasurements();
  const { logs, loading: logsLoading } = useProgressLogs();
  const { goals, loading: goalsLoading } = useGoals();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');

  const activeWeightGoal = goals.find((g) => g.isActive && WEIGHT_GOAL_TYPES.includes(g.type));

  const handleSaveMeasurement = async (data) => {
    await addEntry(data);
    setIsModalOpen(false);
  };

  return (
    <div className="page-container">
      <PageHeader title="Progress" showBack sticky />

      <div className="page-header">
        <h2>Body Weight</h2>
        <Button variant="secondary" size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add
        </Button>
      </div>
      {measurementsLoading || goalsLoading ? (
        <SkeletonCard />
      ) : (
        <BodyWeightChart measurements={measurements} targetWeight={getWeightGoalTarget(activeWeightGoal)} />
      )}

      <div className="section-title">Exercise Progress</div>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <ExerciseSelector value={selectedExerciseId} onChange={setSelectedExerciseId} />
      </div>
      {logsLoading ? (
        <SkeletonCard />
      ) : (
        <ExerciseProgressChart logs={logs} exerciseId={selectedExerciseId} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Measurement"
      >
        <MeasurementForm
          onSave={handleSaveMeasurement}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default Progress;
