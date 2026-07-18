import { NavLink } from 'react-router-dom';
import './BottomNav.css';

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink
        to="/exercises"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        Exercises
      </NavLink>
      <NavLink
        to="/plans"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        Plans
      </NavLink>
      <NavLink
        to="/progress"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        Progress
      </NavLink>
    </nav>
  );
}

export default BottomNav;