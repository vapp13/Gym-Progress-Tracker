import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/userProfile.service';

const DEFAULT_PROFILE = {
  profile: {
    dateOfBirth: '',
    height: null,
    gender: '',
    goal: 'fitness',
    experienceLevel: 'beginner',
    activityLevel: 'moderate',
  },
  trainingPreferences: {
    daysPerWeek: 3,
    sessionDuration: 45,
    preferredTime: 'morning',
    equipment: 'full-gym',
  },
  gymPreferences: {
    cityArea: '',
    preferredGyms: [],
    typicalDays: [],
    typicalTimes: [],
  },
  visibility: {
    goals: 'friends',
    trainingActivity: 'friends',
    progressSummaries: 'friends',
  },
};

export function useUserProfile() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const doc = await getUserProfile(user.uid);
      setData({
        displayName: doc?.displayName || user.displayName,
        email: doc?.email || user.email,
        photoURL: doc?.photoURL || user.photoURL,
        preferences: { theme: 'dark', units: 'metric', ...(doc?.preferences || {}) },
        profile: { ...DEFAULT_PROFILE.profile, ...(doc?.profile || {}) },
        trainingPreferences: { ...DEFAULT_PROFILE.trainingPreferences, ...(doc?.trainingPreferences || {}) },
        gymPreferences: { ...DEFAULT_PROFILE.gymPreferences, ...(doc?.gymPreferences || {}) },
        visibility: { ...DEFAULT_PROFILE.visibility, ...(doc?.visibility || {}) },
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const saveSection = async (sectionKey, sectionData) => {
    const merged = { ...(data?.[sectionKey] || {}), ...sectionData };
    await updateUserProfile(user.uid, { [sectionKey]: merged });
    await fetchProfile();
  };

  // Single write covering every settings section at once, for the
  // Settings page's one Save button.
  const saveAll = async ({ profile, trainingPreferences, gymPreferences, visibility, units }) => {
    await updateUserProfile(user.uid, {
      profile: { ...data.profile, ...profile },
      trainingPreferences: { ...data.trainingPreferences, ...trainingPreferences },
      gymPreferences: { ...data.gymPreferences, ...gymPreferences },
      visibility: { ...data.visibility, ...visibility },
      preferences: { ...data.preferences, units: units ?? data.preferences.units },
    });
    await fetchProfile();
  };

  return { data, loading, error, saveSection, saveAll, refetch: fetchProfile };
}
