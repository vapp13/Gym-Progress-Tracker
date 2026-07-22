import { useState } from 'react';
import { RefreshCw, Link2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { backfillPerformanceData } from '../../services/backfill.service';
import { repairPlanExerciseLinks } from '../../services/planRepair.service';
import Card from '../../components/Card';
import Button from '../../components/Button';

function DataMaintenanceCard() {
  const { user } = useAuth();
  const [status, setStatus] = useState('idle'); // idle | running | done
  const [progress, setProgress] = useState({ processed: 0, total: 0 });
  const [repairStatus, setRepairStatus] = useState('idle'); // idle | running | done
  const [repairResult, setRepairResult] = useState(null);

  const handleRebuild = async () => {
    setStatus('running');
    setProgress({ processed: 0, total: 0 });
    const result = await backfillPerformanceData(user.uid, (processed, total) => {
      setProgress({ processed, total });
    });
    setStatus('done');
    setProgress({ processed: result.sessionsProcessed, total: result.sessionsProcessed });
  };

  const handleRepairLinks = async () => {
    setRepairStatus('running');
    const result = await repairPlanExerciseLinks(user.uid);
    setRepairStatus('done');
    setRepairResult(result);
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
        style={{ width: '100%', marginBottom: 'var(--space-md)' }}
      >
        {status === 'running'
          ? `Processing... (${progress.processed}/${progress.total || '?'})`
          : status === 'done'
            ? `Done — ${progress.processed} workout${progress.processed === 1 ? '' : 's'} processed`
            : 'Rebuild Performance Data'}
      </Button>

      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', margin: '0 0 10px 0' }}>
        Fixes exercises in saved workout plans that are missing their info icon, difficulty, or muscle/equipment
        tags — this happens if an exercise was ever deleted and re-added in the library. Re-links plan exercises
        to the correct current exercise by matching their name.
      </p>
      <Button
        variant="secondary"
        icon={Link2}
        onClick={handleRepairLinks}
        disabled={repairStatus === 'running'}
        style={{ width: '100%' }}
      >
        {repairStatus === 'running' ? 'Checking plans...' : 'Repair Plan Exercise Links'}
      </Button>
      {repairStatus === 'done' && repairResult && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 'var(--space-sm) 0 0 0' }}>
          {repairResult.entriesRepaired === 0 && repairResult.entriesUnmatched === 0
            ? 'Everything already checks out — no repairs needed.'
            : `Repaired ${repairResult.entriesRepaired} exercise${repairResult.entriesRepaired === 1 ? '' : 's'} across ${repairResult.plansRepaired} plan${repairResult.plansRepaired === 1 ? '' : 's'}.`}
          {repairResult.entriesUnmatched > 0 && (
            <> {repairResult.entriesUnmatched} exercise{repairResult.entriesUnmatched === 1 ? '' : 's'} couldn't be matched automatically and may need manual review.</>
          )}
        </p>
      )}
    </Card>
  );
}

export default DataMaintenanceCard;
