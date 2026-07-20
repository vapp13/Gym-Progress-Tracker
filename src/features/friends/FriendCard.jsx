import { Flame, UserMinus } from 'lucide-react';
import AvatarDisplay from '../profile/AvatarDisplay';
import './FriendCard.css';

function FriendCard({ friend, onRemove }) {
  return (
    <div className="friend-card">
      <AvatarDisplay photoURL={friend.photoURL} name={friend.displayName} size={44} />
      <div className="friend-card-main">
        <h3>{friend.displayName || 'Unknown user'}</h3>
        {typeof friend.streak === 'number' && (
          <p className="friend-card-streak">
            <Flame size={13} /> {friend.streak} day{friend.streak === 1 ? '' : 's'}
          </p>
        )}
      </div>
      <button
        className="friend-card-remove"
        onClick={onRemove}
        aria-label={`Remove ${friend.displayName || 'friend'}`}
      >
        <UserMinus size={16} />
      </button>
    </div>
  );
}

export default FriendCard;
