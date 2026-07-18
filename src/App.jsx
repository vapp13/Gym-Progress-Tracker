import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ExerciseLibrary from './pages/ExerciseLibrary';
import WorkoutPlans from './pages/WorkoutPlans';
import ProtectedRoute from './features/auth/ProtectedRoute';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercises"
          element={
            <ProtectedRoute>
              <ExerciseLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <ProtectedRoute>
              <WorkoutPlans />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;