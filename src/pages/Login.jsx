import { Navigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../features/auth/GoogleSignInButton';
import './Login.css';

function Login() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p aria-live="polite" style={{ padding: 24 }}>Loading...</p>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-page">
      <div className="login-glow" aria-hidden="true" />
      <div className="login-content">
        <div className="login-logo">
          <Dumbbell size={28} strokeWidth={2.5} />
        </div>
        <h1 className="login-title">Gym Progress Tracker</h1>
        <p className="login-subtitle">
          Track workouts, hit your goals, and watch your progress add up.
        </p>
        <div className="login-action">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}

export default Login;
