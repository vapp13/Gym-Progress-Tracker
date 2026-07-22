import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMeasurements } from '../hooks/useMeasurements';
import { useProgressLogs } from '../hooks/useProgressLogs';
import { useGoals } from '../hooks/useGoals';
import { useUserProfile } from '../hooks/useUserProfile';
import { usePersonalRecords } from '../hooks/usePersonalRecords';
import { getPublicProfile } from '../services/publicProfile.service';
import ProgressSummaryCards from '../features/progress/ProgressSummaryCards';
import ActiveGoalCard from '../features/goals/ActiveGoalCard';
import AchievementsList from '../features/profile/AchievementsList';
import MeasurementSelectorModal from '../features/progress/MeasurementSelectorModal';
import DateRangeFilter from '../features/progress/DateRangeFilter';
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
import { filterByDateRange } from '../utils/dateRangeFilter';

const WEIGHT_GOAL_TYPES = ['weight', 'lose-weight', 'gain-weight', 'maintain-weight'];
const TOP_RECORDS_LIMIT = 7;

function getWeightGoalTarget(goal) {
  if (!goal) return undefined;
  return goal.metrics ? goal.metrics.target : goal.targetValue;
}

function Progress() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { measurements, loading: measurementsLoading, addEntry, editEntry, removeEntry } = useMeasurements();
  const { logs, loading: logsLoading } = useProgressLogs();
  const { goals, loading: goalsLoading } = useGoals();
  const { data: profile, loading: profileLoading } = useUserProfile();
  const { records: personalRecords, loading: recordsLoading } = usePersonalRecords();
  const [achievements, setAchievements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMeasurementPickerOpen, setIsMeasurementPickerOpen] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState('weight');
  const [dateRange, setDateRange] = useState('6m');
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    if (!user) return;
    getPublicProfile(user.uid).then((data) => {
      setAchievements(data?.achievements || []);
    });
  }, [user]);

  const units = profile?.preferences?.units || 'metric';
  const activeGoal = goals.find((g) => g.isActive);
  const activeWeightGoal = goals.find((g) => g.isActive && WEIGHT_GOAL_TYPES.includes(g.type));
  const selectedField = getMeasurementField(selectedMeasurement);

  const isLoading = measurementsLoading || goalsLoading || profileLoading;

  // Date range filtering is purely client-side on the measurements already
  // fetched for this page — no extra reads, just fewer points plotted so
  // the graph stays readable once there's a long history.
  const chartMeasurements = filterByDateRange(measurements, dateRange);

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
      <PageHeader title="Profile" showBack sticky />

      {/* Body Metrics */}
      {isLoading ? (
        <SkeletonCard />
      ) : (
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <ProgressSummaryCards measurements={measurements} units={units} profile={profile} />
        </div>
      )}

      {/* Active Goal — display-only summary */}
      {!isLoading && activeGoal && (
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <div className="section-title" style={{ marginTop: 0 }}>Active Goal</div>
          <ActiveGoalCard goal={activeGoal} measurements={measurements} />
        </div>
      )}

      {/* Body Measurements — actions */}
      <div className="section-title">Body Measurements</div>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)} style={{ flex: 1 }}>
          Add Body Measurement
        </Button>
        <Button variant="secondary" onClick={() => navigate('/body-metrics')} style={{ flex: 1 }}>
          View Body Metrics
        </Button>
      </div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', margin: '0 0 var(--space-sm) 0' }}>
        Measurement Progress
      </h3>
      {isLoading ? (
        <SkeletonCard />
      ) : (
        <>
          <button
            type="button"
            className="set-row-type-trigger"
            onClick={() => setIsMeasurementPickerOpen(true)}
            style={{ marginBottom: 'var(--space-sm)' }}
          >
            <span style={{ flex: 1, textAlign: 'left' }}>{selectedField?.label}</span>
            <ChevronDown size={16} />
          </button>

          <DateRangeFilter value={dateRange} onChange={setDateRange} />

          <MeasurementChart
            measurements={chartMeasurements}
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

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', margin: 'var(--space-lg) 0 var(--space-sm) 0' }}>
        Exercise Progress
      </h3>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <ExerciseSelector value={selectedExerciseId} onChange={setSelectedExerciseId} logs={logs} />
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

      {/* Achievements */}
      <div className="section-title" style={{ marginTop: 'var(--space-xl)' }}>Achievements</div>
      <AchievementsList achievements={achievements} />

      {/* Personal Records */}
      <div className="page-header" style={{ marginTop: 'var(--space-xl)' }}>
        <h2>Personal Records</h2>
        <Button variant="secondary" size="sm" onClick={() => navigate('/personal-records')}>
          View All Records
        </Button>
      </div>
      <ProgressPersonalRecords limit={TOP_RECORDS_LIMIT} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Measurement"
      >
        <MeasurementForm
          onSave={handleSaveMeasurement}
          onCancel={() => setIsModalOpen(false)}
          units={units}
          profile={profile}
        />
      </Modal>

      <MeasurementSelectorModal
        isOpen={isMeasurementPickerOpen}
        onClose={() => setIsMeasurementPickerOpen(false)}
        value={selectedMeasurement}
        onChange={setSelectedMeasurement}
        measurements={measurements}
      />

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
