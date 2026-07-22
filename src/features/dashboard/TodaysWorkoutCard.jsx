import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Zap, ChevronDown, Check, PartyPopper } from 'lucide-react';
import { useWorkoutPlans } from '../../hooks/useWorkoutPlans';
import { useWorkoutSessions } from '../../hooks/useWorkoutSessions';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { SkeletonCard } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import './TodaysWorkoutCard.css';

const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function TodaysWorkoutCard() {
  const { plans, loading } = useWorkoutPlans();
  const { sessions, loading: sessionsLoading } = useWorkoutSessions();
  const navigate = useNavigate();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const todayKey = WEEKDAY_KEYS[new Date().getDay()];
  const scheduledToday = useMemo(
    () => plans.find((p) => p.scheduledDays?.includes(todayKey)),
    [plans, todayKey]
  );

  const completedToday = useMemo(() => {
    const todayDateKey = new Date().toISOString().split('T')[0];
    return sessions.find((s) => {
      if (s.status !== 'completed' || !s.completedAt?.toDate) return false;
      return s.completedAt.toDate().toISOString().split('T')[0] === todayDateKey;
    });
  }, [sessions]);

  if (loading || sessionsLoading) return <SkeletonCard />;

  if (completedToday) {
    return (
      <Card>
        <div className="card-icon-row">
          <span className="card-icon card-icon-success"><PartyPopper size={18} /></span>
          <span className="card-eyebrow">Today's Workout</span>
        </div>
        <h3 style={{ margin: '10px 0 4px 0' }}>Done for today!</h3>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          You completed {completedToday.planName || 'a workout'} today. Nice work.
        </p>
        <Button
          variant="secondary"
          icon={Zap}
          onClick={() => navigate('/free-workout')}
          style={{ width: '100%', marginTop: 'var(--space-sm)' }}
        >
          Train Again
        </Button>
      </Card>
    );
  }

  const defaultPlan = scheduledToday || plans[0];
  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || defaultPlan;
  const isScheduled = selectedPlan && selectedPlan.id === scheduledToday?.id;
  const hasChoice = plans.length > 1;

  return (
    <Card>
      <div className="card-icon-row">
        <span className="card-icon card-icon-primary"><Zap size={18} /></span>
        <span className="card-eyebrow">Today's Workout</span>
      </div>
      {selectedPlan ? (
        <>
          <h3 style={{ margin: '10px 0 4px 0' }}>{selectedPlan.name}</h3>
          <p style={{ margin: '0 0 10px 0', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textTransform: 'capitalize' }}>
            {isScheduled ? 'Scheduled for today' : 'Suggested'} · {selectedPlan.goal} · {selectedPlan.exercises?.length || 0} exercises
          </p>

          {hasChoice && (
            <button
              className="todays-workout-change"
              onClick={() => setIsPickerOpen((prev) => !prev)}
            >
              Choose a different workout
              <ChevronDown size={14} className={isPickerOpen ? 'is-open' : ''} />
            </button>
          )}

          {isPickerOpen && (
            <div className="todays-workout-picker">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  className={`todays-workout-option ${plan.id === selectedPlan.id ? 'is-selected' : ''}`}
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                    setIsPickerOpen(false);
                  }}
                >
                  <span>{plan.name}</span>
                  {plan.id === selectedPlan.id && <Check size={14} />}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
            <Button
              variant="primary"
              icon={PlayCircle}
              onClick={() => navigate(`/plans/${selectedPlan.id}/session`)}
              style={{ flex: 1 }}
            >
              Start Workout
            </Button>
            <Button
              variant="secondary"
              icon={Zap}
              onClick={() => navigate('/free-workout')}
              style={{ flex: 1 }}
            >
              Free Workout
            </Button>
          </div>
        </>
      ) : (
        <>
          <EmptyState message="No plans yet — create one to get started." actionLabel="Create a plan" onAction={() => navigate('/plans/new')} />
          <Button
            variant="secondary"
            icon={Zap}
            onClick={() => navigate('/free-workout')}
            style={{ width: '100%', marginTop: 'var(--space-sm)' }}
          >
            Start Free Workout
          </Button>
        </>
      )}
    </Card>
  );
}

export default TodaysWorkoutCard;
