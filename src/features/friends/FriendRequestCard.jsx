import { Check, X } from 'lucide-react';
import AvatarDisplay from '../profile/AvatarDisplay';
import './FriendRequestCard.css';

function FriendRequestCard({ request, onAccept, onDecline }) {
  return (
    <div className="friend-request-card">
      <AvatarDisplay photoURL={request.fromPhotoURL} name={request.fromDisplayName} size={44} />
      <div className="friend-request-main">
        <h3>{request.fromDisplayName || 'Unknown user'}</h3>
        <p>wants to be friends</p>
      </div>
      <div className="friend-request-actions">
        <button className="friend-request-accept" onClick={onAccept} aria-label="Accept">
          <Check size={16} />
        </button>
        <button className="friend-request-decline" onClick={onDecline} aria-label="Decline">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default FriendRequestCard;
