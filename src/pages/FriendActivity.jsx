import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Flame, Trophy, Dumbbell } from 'lucide-react';
import { getPublicProfile } from '../services/publicProfile.service';
import AvatarDisplay from '../features/profile/AvatarDisplay';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/Skeleton';

function FriendActivity() {
  const { friendId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicProfile(friendId).then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, [friendId]);

  if (loading) {
    return (
      <div className="page-container" aria-live="polite">
        <SkeletonCard />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-container">
        <PageHeader title="Friend" showBack />
        <EmptyState message="Couldn't find this user." />
      </div>
    );
  }

  const achievements = profile.achievements || [];

  return (
    <div className="page-container">
      <PageHeader title={profile.displayName || 'Friend'} showBack sticky />

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <AvatarDisplay photoURL={profile.photoURL} name={profile.displayName} size={56} />
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-display)' }}>
              {profile.displayName || 'Unknown user'}
            </h3>
            {typeof profile.streak === 'number' && (
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-accent)', fontSize: 'var(--text-sm)' }}>
                <Flame size={14} /> {profile.streak} day{profile.streak === 1 ? '' : 's'} streak
              </p>
            )}
          </div>
        </div>
      </Card>

      {profile.lastWorkoutName && (
        <>
          <div className="section-title">Recent Activity</div>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="card-icon card-icon-primary"><Dumbbell size={16} /></span>
              <span style={{ fontSize: 'var(--text-sm)' }}>Last workout: {profile.lastWorkoutName}</span>
            </div>
          </Card>
        </>
      )}

      <div className="section-title">Achievements</div>
      {achievements.length === 0 ? (
        <EmptyState message="No achievements earned yet." icon={Trophy} />
      ) : (
        <Card>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {achievements.map((a) => (
              <li key={a.key} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--text-sm)' }}>
                <Trophy size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                {a.label}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: 'var(--space-md)' }}>
        Only what {profile.displayName || 'this user'} has chosen to share is shown here.
      </p>
    </div>
  );
}

export default FriendActivity;
