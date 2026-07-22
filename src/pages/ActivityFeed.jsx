import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Dumbbell } from 'lucide-react';
import { useFriends } from '../hooks/useFriends';
import AvatarDisplay from '../features/profile/AvatarDisplay';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';

function formatRelativeDate(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';
  const days = Math.round((Date.now() - date.getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// Built entirely from data useFriends() already fetches (each friend's
// public profile includes achievements + last workout) — no new reads.
function buildFeedItems(friends) {
  const items = [];

  friends.forEach((friend) => {
    (friend.achievements || []).forEach((achievement) => {
      items.push({
        key: `${friend.id}-${achievement.key}`,
        friend,
        date: achievement.earnedAt,
        icon: Trophy,
        text: `earned "${achievement.label}"`,
      });
    });

    if (friend.lastWorkoutName && friend.lastWorkoutDate) {
      items.push({
        key: `${friend.id}-last-workout`,
        friend,
        date: friend.lastWorkoutDate,
        icon: Dumbbell,
        text: `completed ${friend.lastWorkoutName}`,
      });
    }
  });

  return items.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function ActivityFeed() {
  const navigate = useNavigate();
  const { friends, loading } = useFriends();
  const feedItems = useMemo(() => buildFeedItems(friends), [friends]);

  return (
    <div className="page-container">
      <PageHeader title="Activity Feed" showBack sticky />

      {loading ? (
        <div aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton height="60px" radius="var(--radius-lg)" />
          <Skeleton height="60px" radius="var(--radius-lg)" />
        </div>
      ) : friends.length === 0 ? (
        <EmptyState message="Add friends to see their activity here." actionLabel="Go to Friends" onAction={() => navigate('/friends')} />
      ) : feedItems.length === 0 ? (
        <EmptyState message="No recent activity from your friends yet — only what they've chosen to share appears here." />
      ) : (
        <div>
          {feedItems.map((item) => (
            <Card key={item.key} interactive onClick={() => navigate(`/friends/${item.friend.id}`)} style={{ marginBottom: 'var(--space-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <AvatarDisplay photoURL={item.friend.photoURL} name={item.friend.displayName} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>
                    <strong>{item.friend.displayName || 'A friend'}</strong> {item.text}
                  </p>
                  <p style={{ margin: '2px 0 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                    {formatRelativeDate(item.date)}
                  </p>
                </div>
                <item.icon size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityFeed;
