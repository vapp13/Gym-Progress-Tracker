import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/BottomNav';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <header className="top-bar">
        <Link to="/" className="top-bar-home">Fitness App</Link>
      </header>
      {children}
      <BottomNav />
    </>
  );
}

export default ProtectedRoute;