import { Info } from 'lucide-react';
import Card from '../../components/Card';
import { calculateAge } from '../../utils/age';
import {
  calculateBMR,
  calculateTDEE,
  calculateCalorieTargets,
  calculateIdealBodyWeight,
  calculateBodySurfaceArea,
} from '../../utils/bodyMetrics';

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

// Shared by the standalone Body Metrics page and the Profile overview page,
// so this calculation + rendering only exists once.
function CalorieAndEstimatesSection({ profile, weight }) {
  const height = profile?.profile?.height || null;
  const age = calculateAge(profile?.profile?.dateOfBirth);
  const gender = profile?.profile?.gender;
  const activityLevel = profile?.profile?.activityLevel;

  const hasEnoughData = Boolean(weight && height);

  const bmr = hasEnoughData ? calculateBMR(weight, height, age, gender) : null;
  const tdee = bmr ? calculateTDEE(bmr, activityLevel) : null;
  const calorieTargets = calculateCalorieTargets(tdee);
  const idealWeight = hasEnoughData ? calculateIdealBodyWeight(height, gender) : null;
  const bsa = hasEnoughData ? calculateBodySurfaceArea(weight, height) : null;

  if (!hasEnoughData) return null;

  return (
    <>
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
  );
}

export default CalorieAndEstimatesSection;
