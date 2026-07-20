import { useUserProfile } from '../hooks/useUserProfile';
import PersonalInfoForm from '../features/profile/PersonalInfoForm';
import FitnessInfoForm from '../features/profile/FitnessInfoForm';
import TrainingPreferencesForm from '../features/profile/TrainingPreferencesForm';
import GymPreferencesForm from '../features/profile/GymPreferencesForm';
import VisibilitySettingsForm from '../features/profile/VisibilitySettingsForm';
import { SkeletonCard } from '../components/Skeleton';

function Settings() {
  const { data, loading, error, saveSection } = useUserProfile();

  if (error) return <p aria-live="assertive">Error: {error}</p>;

  if (loading || !data) {
    return (
      <div className="page-container" aria-live="polite">
        <div className="page-header"><h1>Settings</h1></div>
        <SkeletonCard />
      </div>
    );
  }

  const handleSavePersonal = async (profileData) => {
    await saveSection('profile', profileData);
  };

  const handleUnitsChange = async (units) => {
    await saveSection('preferences', { units });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <PersonalInfoForm
          profile={data.profile}
          units={data.preferences.units}
          onSave={handleSavePersonal}
          onUnitsChange={handleUnitsChange}
        />

        <FitnessInfoForm
          profile={data.profile}
          onSave={(profileData) => saveSection('profile', profileData)}
        />

        <TrainingPreferencesForm
          preferences={data.trainingPreferences}
          onSave={(prefs) => saveSection('trainingPreferences', prefs)}
        />

        <GymPreferencesForm
          gymPreferences={data.gymPreferences}
          onSave={(prefs) => saveSection('gymPreferences', prefs)}
        />

        <VisibilitySettingsForm
          visibility={data.visibility}
          onSave={(vis) => saveSection('visibility', vis)}
        />
      </div>
    </div>
  );
}

export default Settings;
