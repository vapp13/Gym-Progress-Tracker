import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './features/auth/ProtectedRoute';
import Login from './pages/Login';
import PageLoader from './components/PageLoader';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ExerciseLibrary = lazy(() => import('./pages/ExerciseLibrary'));
const WorkoutPlans = lazy(() => import('./pages/WorkoutPlans'));
const WorkoutPlanEditor = lazy(() => import('./pages/WorkoutPlanEditor'));
const WorkoutSession = lazy(() => import('./pages/WorkoutSession'));
const WorkoutHistory = lazy(() => import('./pages/WorkoutHistory'));
const SessionDetail = lazy(() => import('./pages/SessionDetail'));
const Goals = lazy(() => import('./pages/Goals'));
const GoalDetail = lazy(() => import('./pages/GoalDetail'));
const Progress = lazy(() => import('./pages/Progress'));
const PersonalRecords = lazy(() => import('./pages/PersonalRecords'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Friends = lazy(() => import('./pages/Friends'));
const FriendActivity = lazy(() => import('./pages/FriendActivity'));
const ExerciseHistory = lazy(() => import('./pages/ExerciseHistory'));
const BodyMetrics = lazy(() => import('./pages/BodyMetrics'));

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<PageLoader />}>
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
            path="/free-workout"
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
            path="/history/:sessionId"
            element={
              <ProtectedRoute>
                <SessionDetail />
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
            path="/goals/:goalId"
            element={
              <ProtectedRoute>
                <GoalDetail />
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
          <Route
            path="/personal-records"
            element={
              <ProtectedRoute>
                <PersonalRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <ProtectedRoute>
                <Friends />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friends/:friendId"
            element={
              <ProtectedRoute>
                <FriendActivity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercises/:exerciseId/history"
            element={
              <ProtectedRoute>
                <ExerciseHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/body-metrics"
            element={
              <ProtectedRoute>
                <BodyMetrics />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;