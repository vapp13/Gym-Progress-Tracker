import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="page-container">
      <h1>Dashboard</h1>
      <p>Welcome, {user?.displayName}</p>
      <Link to="/history">View Workout History</Link>
      <div style={{ marginTop: 16 }}>
        <Button variant="danger" onClick={logout}>Sign Out</Button>
      </div>
    </div>
  );
}

export default Dashboard;