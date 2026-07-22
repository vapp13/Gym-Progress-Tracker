import { useState, useEffect } from 'react';
import { Save, Check, AlertCircle } from 'lucide-react';
import { useUserProfile } from '../hooks/useUserProfile';
import PersonalInfoForm from '../features/profile/PersonalInfoForm';
import FitnessInfoForm from '../features/profile/FitnessInfoForm';
import TrainingPreferencesForm from '../features/profile/TrainingPreferencesForm';
import GymPreferencesForm from '../features/profile/GymPreferencesForm';
import VisibilitySettingsForm from '../features/profile/VisibilitySettingsForm';
import AppearanceSettingsCard from '../features/profile/AppearanceSettingsCard';
import DataExportImportCard from '../features/profile/DataExportImportCard';
import DataMaintenanceCard from '../features/profile/DataMaintenanceCard';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { SkeletonCard } from '../components/Skeleton';
import { toArray } from '../utils/textFormatting';

function Settings() {
  const { data, loading, error, saveAll } = useUserProfile();
  const [form, setForm] = useState(null);
  const [units, setUnits] = useState('metric');
  const [saveState, setSaveState] = useState('idle'); // idle | saving | success | error
  const [saveMessage, setSaveMessage] = useState('');

  // Initialize local editable state once, when data first loads. Doesn't
  // re-sync on later refetches, so it never overwrites in-progress edits.
  useEffect(() => {
    if (data && !form) {
      setForm({
        profile: data.profile,
        trainingPreferences: data.trainingPreferences,
        gymPreferences: {
          ...data.gymPreferences,
          preferredGymsText: (data.gymPreferences.preferredGyms || []).join(', '),
        },
        visibility: data.visibility,
      });
      setUnits(data.preferences.units);
    }
  }, [data, form]);

  if (error) return <p aria-live="assertive">Error: {error}</p>;

  if (loading || !form) {
    return (
      <div className="page-container" aria-live="polite">
        <PageHeader title="Settings" showBack />
        <SkeletonCard />
      </div>
    );
  }

  const updateSection = (sectionKey, updatedValue) => {
    setForm((prev) => ({ ...prev, [sectionKey]: updatedValue }));
    if (saveState !== 'idle') setSaveState('idle');
  };

  const handleSaveAll = async () => {
    setSaveState('saving');
    try {
      await saveAll({
        profile: form.profile,
        trainingPreferences: form.trainingPreferences,
        gymPreferences: {
          cityArea: form.gymPreferences.cityArea,
          preferredGyms: toArray(form.gymPreferences.preferredGymsText),
          typicalDays: form.gymPreferences.typicalDays,
          typicalTimes: form.gymPreferences.typicalTimes,
        },
        visibility: form.visibility,
        units,
      });
      setSaveState('success');
      setSaveMessage('Settings saved.');
    } catch (err) {
      setSaveState('error');
      setSaveMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Settings" showBack sticky />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <PersonalInfoForm
          value={form.profile}
          units={units}
          onChange={(updated) => updateSection('profile', updated)}
          onUnitsChange={(newUnits) => {
            setUnits(newUnits);
            if (saveState !== 'idle') setSaveState('idle');
          }}
        />

        <FitnessInfoForm
          value={form.profile}
          onChange={(updated) => updateSection('profile', updated)}
        />

        <TrainingPreferencesForm
          value={form.trainingPreferences}
          onChange={(updated) => updateSection('trainingPreferences', updated)}
        />

        <GymPreferencesForm
          value={form.gymPreferences}
          onChange={(updated) => updateSection('gymPreferences', updated)}
        />

        <VisibilitySettingsForm
          value={form.visibility}
          onChange={(updated) => updateSection('visibility', updated)}
        />

        <AppearanceSettingsCard />

        <DataExportImportCard />

        <DataMaintenanceCard />

        <div className="settings-save-bar">
          {saveState === 'success' && (
            <p className="settings-save-feedback settings-save-success">
              <Check size={14} /> {saveMessage}
            </p>
          )}
          {saveState === 'error' && (
            <p className="settings-save-feedback settings-save-error">
              <AlertCircle size={14} /> {saveMessage}
            </p>
          )}
          <Button
            variant="primary"
            icon={Save}
            onClick={handleSaveAll}
            disabled={saveState === 'saving'}
            style={{ width: '100%' }}
          >
            {saveState === 'saving' ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
