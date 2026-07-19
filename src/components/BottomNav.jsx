import { NavLink } from 'react-router-dom';
import { Dumbbell, ClipboardList, TrendingUp, Target } from 'lucide-react';
import './BottomNav.css';

const ITEMS = [
  { to: '/exercises', label: 'Exercises', icon: Dumbbell },
  { to: '/plans', label: 'Plans', icon: ClipboardList },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
];

function BottomNav() {
  return (
    <nav className="bottom-nav-wrapper">
      <div className="bottom-nav">
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} strokeWidth={2.25} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
