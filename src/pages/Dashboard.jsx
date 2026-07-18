import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 16 }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.displayName}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger" onClick={logout}>Sign Out</Button>
      </div>
    </div>
  );
}

export default Dashboard;