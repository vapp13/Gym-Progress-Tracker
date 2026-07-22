import { useEffect, useState } from 'react';
import { playRestCompleteAlert } from '../../utils/restTimerAlert';
import './RestTimer.css';

function RestTimer({ seconds, onComplete, onSkip }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      playRestCompleteAlert();
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining, onComplete]);

  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="rest-timer">
      <span className="rest-timer-label">Rest</span>
      <span className="rest-timer-clock">
        {minutes}:{secs.toString().padStart(2, '0')}
      </span>
      <button className="rest-timer-skip" onClick={onSkip}>
        Skip
      </button>
    </div>
  );
}

export default RestTimer;