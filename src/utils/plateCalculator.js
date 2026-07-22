// Standard plate sets per unit system — both bar weights and plate sizes
// differ between metric (Olympic) and imperial (standard) setups.
const METRIC_BAR_WEIGHT = 20;
const METRIC_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];

const IMPERIAL_BAR_WEIGHT = 45;
const IMPERIAL_PLATES = [45, 35, 25, 10, 5, 2.5];

export function calculatePlates(targetWeight, units = 'metric') {
  const barWeight = units === 'imperial' ? IMPERIAL_BAR_WEIGHT : METRIC_BAR_WEIGHT;
  const plates = units === 'imperial' ? IMPERIAL_PLATES : METRIC_PLATES;

  if (!targetWeight || targetWeight <= barWeight) {
    return { barWeight, perSide: [], achievedWeight: barWeight, isExact: targetWeight === barWeight };
  }

  let remainingPerSide = (targetWeight - barWeight) / 2;
  const perSide = [];

  plates.forEach((plate) => {
    const count = Math.floor(remainingPerSide / plate + 1e-6);
    if (count > 0) {
      perSide.push({ plate, count });
      remainingPerSide -= count * plate;
    }
  });

  const platedPerSide = perSide.reduce((sum, p) => sum + p.plate * p.count, 0);
  const achievedWeight = barWeight + platedPerSide * 2;

  return {
    barWeight,
    perSide,
    achievedWeight: Math.round(achievedWeight * 100) / 100,
    isExact: Math.abs(achievedWeight - targetWeight) < 0.01,
  };
}
