import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AvatarDisplay from '../features/profile/AvatarDisplay';
import './TopBar.css';

function TopBar() {
  const { user } = useAuth();

  return (
    <header className="top-bar">
      <Link to="/" className="top-bar-brand">
        <span className="top-bar-icon">
          <Dumbbell size={18} strokeWidth={2.5} />
        </span>
        <span className="top-bar-title">Gym Progress Tracker</span>
      </Link>
      <Link to="/profile" className="top-bar-avatar-link" aria-label="Profile">
        <AvatarDisplay photoURL={user?.photoURL} name={user?.displayName} size={32} />
      </Link>
    </header>
  );
}

export default TopBar;
