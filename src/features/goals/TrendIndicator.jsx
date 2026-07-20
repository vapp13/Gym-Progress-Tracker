import { TrendingUp, Minus, TrendingDown } from 'lucide-react';
import '../../components/ComparisonIndicator.css';

const CONFIG = {
  Improving: { Icon: TrendingUp, className: 'comparison-up' },
  Stable: { Icon: Minus, className: 'comparison-same' },
  Behind: { Icon: TrendingDown, className: 'comparison-down' },
};

function TrendIndicator({ trend }) {
  if (!trend) return null;
  const { Icon, className } = CONFIG[trend] || CONFIG.Stable;

  return (
    <span className={`comparison-indicator ${className}`}>
      <Icon size={12} />
      {trend}
    </span>
  );
}

export default TrendIndicator;
