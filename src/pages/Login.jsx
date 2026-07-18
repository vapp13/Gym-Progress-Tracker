import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../features/auth/GoogleSignInButton';

function Login() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h1>Welcome to Fitness App</h1>
      <p>Sign in to track your workouts and progress.</p>
      <GoogleSignInButton />
    </div>
  );
}

export default Login;