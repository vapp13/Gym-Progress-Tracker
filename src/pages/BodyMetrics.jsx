import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import { useMeasurements } from '../hooks/useMeasurements';
import PageHeader from '../components/PageHeader';
import { calculateBMI, getBMICategory, calculateBMR, calculateTDEE } from '../utils/bodyMetrics';
import { calculateAge } from '../utils/age';
import Card from '../components/Card';
import CalorieAndEstimatesSection from '../features/progress/CalorieAndEstimatesSection';
import { SkeletonCard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

function MetricRow({ label, value, unit, sublabel }) {
  return (
    <div className="metric-row">
      <div>
        <span className="metric-row-label">{label}</span>
        {sublabel && <p className="metric-row-sublabel">{sublabel}</p>}
      </div>
      <span className="metric-row-value">
        {value ?? '—'}{value !== null && unit && <span className="metric-row-unit"> {unit}</span>}
      </span>
    </div>
  );
}

function BodyMetrics() {
  const navigate = useNavigate();
  const { data: profile, loading: profileLoading } = useUserProfile();
  const { measurements, loading: measurementsLoading } = useMeasurements();

  const loading = profileLoading || measurementsLoading;

  if (loading || !profile) {
    return (
      <div className="page-container" aria-live="polite">
        <SkeletonCard />
      </div>
    );
  }

  const weight = measurements[0]?.weight || null;
  const height = profile.profile.height || null;
  const age = calculateAge(profile.profile.dateOfBirth);
  const gender = profile.profile.gender;
  const activityLevel = profile.profile.activityLevel;

  const hasEnoughData = weight && height;

  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);

  return (
    <div className="page-container">
      <PageHeader title="Body Metrics" showBack sticky />

      {!hasEnoughData ? (
        <EmptyState
          message="Add your height (Settings) and log a weight measurement (Progress) to see calculated metrics."
          actionLabel="Go to Settings"
          onAction={() => navigate('/settings')}
        />
      ) : (
        <>
          <Card>
            <MetricRow label="BMI" value={bmi} sublabel={bmiCategory} />
            <MetricRow label="BMR" value={bmr} unit="kcal/day" sublabel="Calories burned at rest" />
            <MetricRow label="TDEE" value={tdee} unit="kcal/day" sublabel="Total daily energy expenditure" />
          </Card>

          <CalorieAndEstimatesSection profile={profile} weight={weight} />
        </>
      )}
    </div>
  );
}

export default BodyMetrics;
