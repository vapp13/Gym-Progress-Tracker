import Modal from '../../components/Modal';
import { calculatePlates } from '../../utils/plateCalculator';
import './PlateCalculatorModal.css';

function PlateCalculatorModal({ isOpen, onClose, weight, units = 'metric' }) {
  const { barWeight, perSide, achievedWeight, isExact } = calculatePlates(weight, units);
  const unitLabel = units === 'imperial' ? 'lb' : 'kg';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Plate Calculator">
      <p style={{ margin: '0 0 var(--space-md) 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
        Target: {weight}{unitLabel} · Bar: {barWeight}{unitLabel}
      </p>

      {perSide.length === 0 ? (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Just the bar — no plates needed.
        </p>
      ) : (
        <div className="plate-calculator-stack">
          {perSide.map((p) => (
            <div key={p.plate} className="plate-calculator-row">
              <span className="plate-calculator-plate" style={{ height: Math.max(28, p.plate) }}>
                {p.plate}
              </span>
              <span className="plate-calculator-count">× {p.count} per side</span>
            </div>
          ))}
        </div>
      )}

      {!isExact && (
        <p className="plate-calculator-note">
          Closest achievable with these plates: {achievedWeight}{unitLabel}
        </p>
      )}
    </Modal>
  );
}

export default PlateCalculatorModal;
