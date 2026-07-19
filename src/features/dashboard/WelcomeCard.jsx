import { useAuth } from '../../context/AuthContext';
import './WelcomeCard.css';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return 'Still up';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function WelcomeCard() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  return (
    <div className="welcome-card">
      <div>
        <p className="welcome-greeting">{getGreeting()},</p>
        <h1 className="welcome-name">{firstName}</h1>
      </div>
      {user?.photoURL && (
        <img src={user.photoURL} alt="" className="welcome-avatar" />
      )}
    </div>
  );
}

export default WelcomeCard;
