import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import './ComparisonIndicator.css';

const CONFIG = {
  up: { Icon: ArrowUp, className: 'comparison-up' },
  down: { Icon: ArrowDown, className: 'comparison-down' },
  same: { Icon: Minus, className: 'comparison-same' },
};

function ComparisonIndicator({ direction, delta, unit = '' }) {
  const { Icon, className } = CONFIG[direction] || CONFIG.same;
  const label = direction === 'same' ? 'No change' : `${delta > 0 ? '+' : ''}${delta}${unit}`;

  return (
    <span className={`comparison-indicator ${className}`}>
      <Icon size={12} />
      {label}
    </span>
  );
}

export default ComparisonIndicator;
