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

      <div className="card-grid card-grid-2" style={{ marginBottom: 'var(--space-md)' }}>
        <TodaysWorkoutCard />
        <CurrentGoalCard />
      </div>

      <div className="card-grid card-grid-2" style={{ marginBottom: 'var(--space-md)' }}>
        <WeeklyProgressCard />
        <StreakCard />
      </div>

      <div className="card-grid card-grid-2" style={{ marginBottom: 'var(--space-md)' }}>
        <RecentWorkoutsCard />
        <PersonalRecordsCard />
      </div>

      <div style={{ marginBottom: 'var(--space-md)' }}>
        <BodyMetricsCard />
      </div>

      <QuickActionsCard />
    </div>
  );
}

export default Dashboard;
