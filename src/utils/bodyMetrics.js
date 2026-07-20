// General-purpose fitness estimates using standard, widely-published
// formulas. These are informational estimates only — not medical advice,
// and BMI in particular does not distinguish muscle mass from fat mass.

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
};

export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function getBMICategory(bmi) {
  if (bmi === null) return null;
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

// Mifflin-St Jeor equation. For genders outside male/female, uses the
// average of both constants as a neutral estimate.
export function calculateBMR(weightKg, heightCm, age, gender) {
  if (!weightKg || !heightCm || !age) return null;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') return Math.round(base + 5);
  if (gender === 'female') return Math.round(base - 161);
  return Math.round(base - 78); // midpoint of +5 / -161
}

export function calculateTDEE(bmr, activityLevel) {
  if (!bmr) return null;
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.moderate;
  return Math.round(bmr * multiplier);
}

export function calculateCalorieTargets(tdee) {
  if (!tdee) return null;
  return {
    maintenance: tdee,
    fatLoss: tdee - 500,
    muscleGain: tdee + 300,
  };
}

// Devine formula.
export function calculateIdealBodyWeight(heightCm, gender) {
  if (!heightCm) return null;
  const heightInches = heightCm / 2.54;
  const inchesOver5Feet = Math.max(0, heightInches - 60);
  const male = 50 + 2.3 * inchesOver5Feet;
  const female = 45.5 + 2.3 * inchesOver5Feet;
  if (gender === 'male') return Math.round(male * 10) / 10;
  if (gender === 'female') return Math.round(female * 10) / 10;
  return Math.round(((male + female) / 2) * 10) / 10;
}

// Mosteller formula.
export function calculateBodySurfaceArea(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  return Math.round(Math.sqrt((heightCm * weightKg) / 3600) * 100) / 100;
}
