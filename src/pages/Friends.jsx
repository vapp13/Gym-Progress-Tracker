import { useNavigate } from 'react-router-dom';
import { Rss } from 'lucide-react';
import { useFriends } from '../hooks/useFriends';
import FriendCard from '../features/friends/FriendCard';
import FriendRequestCard from '../features/friends/FriendRequestCard';
import AddFriendForm from '../features/friends/AddFriendForm';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';

function Friends() {
  const navigate = useNavigate();
  const {
    friends,
    incomingRequests,
    loading,
    error,
    addFriend,
    acceptRequest,
    declineRequest,
    unfriend,
  } = useFriends();

  if (error) return <p aria-live="assertive">Error: {error}</p>;

  return (
    <div className="page-container">
      <PageHeader title="Friends" showBack sticky />

      {friends.length > 0 && (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <Button variant="secondary" icon={Rss} onClick={() => navigate('/activity')} style={{ width: '100%' }}>
            View Activity Feed
          </Button>
        </div>
      )}

      <Card>
        <AddFriendForm onSend={addFriend} />
      </Card>

      {loading ? (
        <div aria-live="polite" style={{ marginTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton height="60px" radius="var(--radius-lg)" />
          <Skeleton height="60px" radius="var(--radius-lg)" />
        </div>
      ) : (
        <>
          {incomingRequests.length > 0 && (
            <>
              <div className="section-title">Requests</div>
              {incomingRequests.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  request={request}
                  onAccept={() => acceptRequest(request.id)}
                  onDecline={() => declineRequest(request.id)}
                />
              ))}
            </>
          )}

          <div className="section-title">Your Friends</div>
          {friends.length === 0 ? (
            <EmptyState message="No friends yet. Share your Friend Code to get started." />
          ) : (
            friends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onClick={() => navigate(`/friends/${friend.id}`)}
                onRemove={() => unfriend(friend.id)}
              />
            ))
          )}
        </>
      )}
    </div>
  );
}

export default Friends;
