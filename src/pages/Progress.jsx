import { useState } from 'react';
import { useMeasurements } from '../hooks/useMeasurements';
import { useProgressLogs } from '../hooks/useProgressLogs';
import BodyWeightChart from '../features/progress/BodyWeightChart';
import MeasurementForm from '../features/progress/MeasurementForm';
import ExerciseSelector from '../features/progress/ExerciseSelector';
import ExerciseProgressChart from '../features/progress/ExerciseProgressChart';
import Modal from '../components/Modal';
import Button from '../components/Button';

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
        <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
          + Add Measurement
        </Button>
      </div>
      {measurementsLoading ? (
        <p>Loading...</p>
      ) : (
        <BodyWeightChart measurements={measurements} />
      )}

      <div style={{ marginTop: 'var(--space-lg)' }}>
        <h2>Exercise Progress</h2>
        <ExerciseSelector value={selectedExerciseId} onChange={setSelectedExerciseId} />
        {logsLoading ? (
          <p>Loading...</p>
        ) : (
          <ExerciseProgressChart logs={logs} exerciseId={selectedExerciseId} />
        )}
      </div>

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