import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './features/auth/ProtectedRoute';
import Login from './pages/Login';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ExerciseLibrary = lazy(() => import('./pages/ExerciseLibrary'));
const WorkoutPlans = lazy(() => import('./pages/WorkoutPlans'));
const WorkoutPlanEditor = lazy(() => import('./pages/WorkoutPlanEditor'));
const WorkoutSession = lazy(() => import('./pages/WorkoutSession'));
const WorkoutHistory = lazy(() => import('./pages/WorkoutHistory'));
const Goals = lazy(() => import('./pages/Goals'));
const Progress = lazy(() => import('./pages/Progress'));

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<p aria-live="polite">Loading...</p>}>
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
          <Route
            path="/plans/new"
            element={
              <ProtectedRoute>
                <WorkoutPlanEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plans/:id/edit"
            element={
              <ProtectedRoute>
                <WorkoutPlanEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plans/:planId/session"
            element={
              <ProtectedRoute>
                <WorkoutSession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <WorkoutHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;