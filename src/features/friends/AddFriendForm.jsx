import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import Button from '../../components/Button';

function AddFriendForm({ onSend }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await onSend(code);
      setStatus({ type: 'success', message: 'Friend request sent!' });
      setCode('');
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      <label className="form-field">
        <span>Add a friend by Friend Code</span>
        <input
          type="text"
          placeholder="Paste their Friend Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </label>
      <Button variant="primary" icon={UserPlus} type="submit" disabled={!code.trim() || submitting}>
        {submitting ? 'Sending...' : 'Send Request'}
      </Button>
      {status && (
        <p
          role="status"
          style={{
            margin: 0,
            fontSize: 'var(--text-xs)',
            color: status.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
          }}
        >
          {status.message}
        </p>
      )}
    </form>
  );
}

export default AddFriendForm;
