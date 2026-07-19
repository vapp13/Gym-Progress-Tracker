import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import './TopBar.css';

function TopBar() {
  return (
    <header className="top-bar glass">
      <Link to="/" className="top-bar-brand">
        <span className="top-bar-icon">
          <Dumbbell size={18} strokeWidth={2.5} />
        </span>
        <span className="top-bar-title">Gym Progress Tracker</span>
      </Link>
    </header>
  );
}

export default TopBar;
