import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { backfillPerformanceData } from '../../services/backfill.service';
import Card from '../../components/Card';
import Button from '../../components/Button';

function DataMaintenanceCard() {
  const { user } = useAuth();
  const [status, setStatus] = useState('idle'); // idle | running | done
  const [progress, setProgress] = useState({ processed: 0, total: 0 });

  const handleRebuild = async () => {
    setStatus('running');
    setProgress({ processed: 0, total: 0 });
    const result = await backfillPerformanceData(user.uid, (processed, total) => {
      setProgress({ processed, total });
    });
    setStatus('done');
    setProgress({ processed: result.sessionsProcessed, total: result.sessionsProcessed });
  };

  return (
    <Card>
      <div className="card-icon-row">
        <span className="card-icon card-icon-primary"><RefreshCw size={18} /></span>
        <span className="card-eyebrow">Data</span>
      </div>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', margin: '4px 0 10px 0' }}>
        Rebuilds "previous performance" and personal records from your existing completed workouts.
        Useful once, after new tracking features are added, or if numbers ever look off.
      </p>
      <Button
        variant="secondary"
        icon={RefreshCw}
        onClick={handleRebuild}
        disabled={status === 'running'}
      >
        {status === 'running'
          ? `Processing... (${progress.processed}/${progress.total || '?'})`
          : status === 'done'
            ? `Done — ${progress.processed} workout${progress.processed === 1 ? '' : 's'} processed`
            : 'Rebuild Performance Data'}
      </Button>
    </Card>
  );
}

export default DataMaintenanceCard;
