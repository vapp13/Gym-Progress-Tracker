import { Inbox } from 'lucide-react';
import Button from './Button';
import './EmptyState.css';

function EmptyState({ message, actionLabel, onAction, icon: Icon = Inbox }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <p>{message}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
