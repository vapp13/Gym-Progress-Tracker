import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import './SessionTimer.css';

function formatElapsed(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

// `startedAt` is a Firestore Timestamp (or null while the session doc is
// still being created) — ticks locally so it doesn't need a write/read
// every second, just a starting reference point from the server.
function SessionTimer({ startedAt }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startedAt?.toDate) return;
    const startMs = startedAt.toDate().getTime();

    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <span className="session-timer">
      <Clock size={14} />
      {formatElapsed(elapsed)}
    </span>
  );
}

export default SessionTimer;
