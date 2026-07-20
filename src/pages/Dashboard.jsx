import WelcomeCard from '../features/dashboard/WelcomeCard';
import CurrentGoalCard from '../features/dashboard/CurrentGoalCard';
import TodaysWorkoutCard from '../features/dashboard/TodaysWorkoutCard';
import WeeklyProgressCard from '../features/dashboard/WeeklyProgressCard';
import StreakCard from '../features/dashboard/StreakCard';
import RecentWorkoutsCard from '../features/dashboard/RecentWorkoutsCard';
import PersonalRecordsCard from '../features/dashboard/PersonalRecordsCard';
import BodyMetricsCard from '../features/dashboard/BodyMetricsCard';
import QuickActionsCard from '../features/dashboard/QuickActionsCard';

function Dashboard() {
  return (
    <div className="page-container">
      <WelcomeCard />

      {/* Row 1 — full width */}
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <TodaysWorkoutCard />
      </div>

      {/* Row 2 */}
      <div className="card-grid card-grid-2" style={{ marginBottom: 'var(--space-md)' }}>
        <CurrentGoalCard />
        <WeeklyProgressCard />
      </div>

      {/* Row 3 */}
      <div className="card-grid card-grid-2" style={{ marginBottom: 'var(--space-md)' }}>
        <StreakCard />
        <PersonalRecordsCard />
      </div>

      {/* Row 4 */}
      <div className="card-grid card-grid-2" style={{ marginBottom: 'var(--space-md)' }}>
        <RecentWorkoutsCard />
        <BodyMetricsCard />
      </div>

      <QuickActionsCard />
    </div>
  );
}

export default Dashboard;
