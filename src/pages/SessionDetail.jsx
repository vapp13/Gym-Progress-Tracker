import { useParams } from 'react-router-dom';
import { Trophy, Clock, Dumbbell } from 'lucide-react';
import { useWorkoutSessions } from '../hooks/useWorkoutSessions';
import { findPreviousSameplanSession, compareSessionExercises } from '../utils/sessionComparison';
import { isCountableSet } from '../utils/oneRepMax';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import ComparisonIndicator from '../components/ComparisonIndicator';
import { SkeletonCard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

function formatDuration(startedAt, completedAt) {
  if (!startedAt || !completedAt) return null;
  const minutes = Math.round((completedAt.toDate() - startedAt.toDate()) / 60000);
  return `${minutes} min`;
}

function SessionDetail() {
  const { sessionId } = useParams();
  const { sessions, loading } = useWorkoutSessions();

  if (loading) {
    return (
      <div className="page-container" aria-live="polite">
        <SkeletonCard />
      </div>
    );
  }

  const session = sessions.find((s) => s.id === sessionId);

  if (!session) {
    return (
      <div className="page-container">
        <EmptyState message="Session not found." />
      </div>
    );
  }

  const previousSession = findPreviousSameplanSession(sessions, session);
  const comparisons = compareSessionExercises(session, previousSession);
  const comparisonByExercise = Object.fromEntries(comparisons.map((c) => [c.exerciseId, c]));

  const date = session.startedAt?.toDate().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const duration = formatDuration(session.startedAt, session.completedAt);

  return (
    <div className="page-container">
      <PageHeader title={session.planName || 'Workout'} showBack sticky />

      <Card>
        <p style={{ margin: '0 0 6px 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{date}</p>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          {duration && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              <Clock size={13} /> {duration}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            <Dumbbell size={13} /> {session.exercises.length} exercises
          </span>
          {session.prsAchieved?.length > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-accent)' }}>
              <Trophy size={13} /> {session.prsAchieved.length} PR{session.prsAchieved.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {session.notes && (
          <p style={{ margin: 'var(--space-sm) 0 0 0', fontSize: 'var(--text-sm)', fontStyle: 'italic', color: 'var(--color-text)' }}>
            "{session.notes}"
          </p>
        )}
        {previousSession && (
          <p style={{ margin: 'var(--space-sm) 0 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
            Compared to your previous {session.planName || 'workout'} on{' '}
            {previousSession.completedAt?.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </p>
        )}
      </Card>

      <div className="section-title">Exercises</div>
      {session.exercises.map((exercise, i) => {
        const comparison = comparisonByExercise[exercise.exerciseId];
        const workingSets = exercise.sets.filter(isCountableSet);
        return (
          <Card key={i} className="session-detail-exercise-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)' }}>
                {exercise.exerciseName}
              </h3>
            </div>

            {comparison && (
              <div className="session-detail-comparison">
                <div>
                  <span className="session-detail-comparison-label">Weight</span>
                  <ComparisonIndicator direction={comparison.weight.direction} delta={comparison.weight.delta} unit="kg" />
                </div>
                <div>
                  <span className="session-detail-comparison-label">Reps</span>
                  <ComparisonIndicator direction={comparison.reps.direction} delta={comparison.reps.delta} />
                </div>
                <div>
                  <span className="session-detail-comparison-label">Volume</span>
                  <ComparisonIndicator direction={comparison.volume.direction} delta={comparison.volume.delta} unit="kg" />
                </div>
              </div>
            )}

            <ul className="session-detail-set-list">
              {exercise.sets.map((set, si) => (
                <li key={si} className={set.completed ? 'is-completed' : ''}>
                  <span>{set.type && set.type !== 'working' ? `${set.type} · ` : ''}{set.weight}kg × {set.reps}</span>
                  {set.rpe && <span className="session-detail-set-rpe">RPE {set.rpe}</span>}
                </li>
              ))}
            </ul>
            {workingSets.length === 0 && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', margin: 0 }}>No sets logged.</p>
            )}
          </Card>
        );
      })}
    </div>
  );
}

export default SessionDetail;
