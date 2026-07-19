import { useNavigate } from 'react-router-dom';
import { PlusCircle, ClipboardPlus, Target, Ruler } from 'lucide-react';
import './QuickActionsCard.css';

const ACTIONS = [
  { label: 'New Plan', icon: ClipboardPlus, to: '/plans/new' },
  { label: 'New Goal', icon: Target, to: '/goals' },
  { label: 'Log Weight', icon: Ruler, to: '/progress' },
  { label: 'Browse Exercises', icon: PlusCircle, to: '/exercises' },
];

function QuickActionsCard() {
  const navigate = useNavigate();

  return (
    <div>
      <span className="card-eyebrow">Quick Actions</span>
      <div className="quick-actions-grid">
        {ACTIONS.map(({ label, icon: Icon, to }) => (
          <button key={label} className="quick-action" onClick={() => navigate(to)}>
            <span className="quick-action-icon"><Icon size={20} /></span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActionsCard;
