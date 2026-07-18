import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="page-container">
      <h1>Dashboard</h1>
      <p>Welcome, {user?.displayName}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
        <Link to="/history">View Workout History</Link>
        <Link to="/goals">View Goals</Link>
      </div>
      <div style={{ marginTop: 16 }}>
        <Button variant="danger" onClick={logout}>Sign Out</Button>
      </div>
    </div>
  );
}

export default Dashboard;