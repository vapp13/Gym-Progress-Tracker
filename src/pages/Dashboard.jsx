import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.displayName}</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}

export default Dashboard;