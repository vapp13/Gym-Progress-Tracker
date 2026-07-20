import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useMeasurements } from '../hooks/useMeasurements';
import PageHeader from '../components/PageHeader';
import { calculateAge } from '../utils/age';
import {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTDEE,
  calculateCalorieTargets,
  calculateIdealBodyWeight,
  calculateBodySurfaceArea,
} from '../utils/bodyMetrics';
import Card from '../components/Card';
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
  const calorieTargets = calculateCalorieTargets(tdee);
  const idealWeight = calculateIdealBodyWeight(height, gender);
  const bsa = calculateBodySurfaceArea(weight, height);

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

          <div className="section-title">Calorie Targets</div>
          <Card>
            <MetricRow label="Maintenance" value={calorieTargets?.maintenance} unit="kcal" />
            <MetricRow label="Fat Loss" value={calorieTargets?.fatLoss} unit="kcal" sublabel="~500 kcal deficit" />
            <MetricRow label="Muscle Gain" value={calorieTargets?.muscleGain} unit="kcal" sublabel="~300 kcal surplus" />
          </Card>

          <div className="section-title">Other Estimates</div>
          <Card>
            <MetricRow label="Ideal Body Weight" value={idealWeight} unit="kg" sublabel="Devine formula estimate" />
            <MetricRow label="Body Surface Area" value={bsa} unit="m²" sublabel="Mosteller formula" />
          </Card>

          <div className="body-metrics-disclaimer">
            <Info size={16} />
            <p>
              These are general estimates from standard formulas, not medical advice. BMI in particular
              doesn't distinguish muscle mass from fat mass — a muscular person can show a high BMI
              without being overweight. Consult a healthcare professional for personalized guidance.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default BodyMetrics;
