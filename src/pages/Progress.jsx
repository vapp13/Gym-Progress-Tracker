import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useMeasurements } from '../hooks/useMeasurements';
import { useProgressLogs } from '../hooks/useProgressLogs';
import BodyWeightChart from '../features/progress/BodyWeightChart';
import MeasurementForm from '../features/progress/MeasurementForm';
import ExerciseSelector from '../features/progress/ExerciseSelector';
import ExerciseProgressChart from '../features/progress/ExerciseProgressChart';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { SkeletonCard } from '../components/Skeleton';

function Progress() {
  const { measurements, loading: measurementsLoading, addEntry } = useMeasurements();
  const { logs, loading: logsLoading } = useProgressLogs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');

  const handleSaveMeasurement = async (data) => {
    await addEntry(data);
    setIsModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Progress</h1>
      </div>

      <div className="page-header">
        <h2>Body Weight</h2>
        <Button variant="secondary" size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add
        </Button>
      </div>
      {measurementsLoading ? (
        <SkeletonCard />
      ) : (
        <BodyWeightChart measurements={measurements} />
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
