import { useState, useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { useMeasurements } from '../../hooks/useMeasurements';
import { useWorkoutSessions } from '../../hooks/useWorkoutSessions';
import { usePersonalRecords } from '../../hooks/usePersonalRecords';
import { exportMeasurementsToCsv, parseMeasurementsCsv } from '../../utils/measurementCsv';
import { exportWorkoutHistoryToCsv } from '../../utils/workoutHistoryCsv';
import { exportPersonalRecordsToCsv } from '../../utils/personalRecordsCsv';
import { downloadCsv } from '../../utils/csv';
import Card from '../../components/Card';
import Button from '../../components/Button';

function todayStamp() {
  return new Date().toISOString().split('T')[0];
}

function DataExportImportCard() {
  const { measurements, bulkAddEntries } = useMeasurements();
  const { sessions } = useWorkoutSessions();
  const { records } = usePersonalRecords();
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState('idle'); // idle | running | done | error
  const [importResult, setImportResult] = useState(null);

  const handleExportMeasurements = () => {
    downloadCsv(`body-measurements-${todayStamp()}.csv`, exportMeasurementsToCsv(measurements));
  };

  const handleExportHistory = () => {
    downloadCsv(`workout-history-${todayStamp()}.csv`, exportWorkoutHistoryToCsv(sessions));
  };

  const handleExportRecords = () => {
    downloadCsv(`personal-records-${todayStamp()}.csv`, exportPersonalRecordsToCsv(records));
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    setImportStatus('running');
    try {
      const text = await file.text();
      const entries = parseMeasurementsCsv(text);

      if (entries.length === 0) {
        setImportStatus('error');
        setImportResult({ imported: 0, message: 'No valid rows found — check the file matches the exported format.' });
        return;
      }

      await bulkAddEntries(entries);

      setImportStatus('done');
      setImportResult({ imported: entries.length });
    } catch {
      setImportStatus('error');
      setImportResult({ imported: 0, message: 'Could not read that file.' });
    }
  };

  return (
    <Card>
      <div className="card-icon-row">
        <span className="card-icon card-icon-primary"><Download size={18} /></span>
        <span className="card-eyebrow">Export & Import</span>
      </div>

      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', margin: '4px 0 10px 0' }}>
        Download your data as CSV, or import previously-exported body measurements. Values are always in metric (kg/cm), regardless of your display preference, so files export and import consistently.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <Button variant="secondary" icon={Download} onClick={handleExportMeasurements} style={{ width: '100%' }}>
          Export Body Measurements
        </Button>
        <Button variant="secondary" icon={Download} onClick={handleExportHistory} style={{ width: '100%' }}>
          Export Workout History
        </Button>
        <Button variant="secondary" icon={Download} onClick={handleExportRecords} style={{ width: '100%' }}>
          Export Personal Records
        </Button>

        <Button
          variant="secondary"
          icon={Upload}
          onClick={handleImportClick}
          disabled={importStatus === 'running'}
          style={{ width: '100%' }}
        >
          {importStatus === 'running' ? 'Importing...' : 'Import Body Measurements'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelected}
          style={{ display: 'none' }}
        />

        {importStatus === 'done' && importResult && (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', margin: 0 }}>
            Imported {importResult.imported} measurement{importResult.imported === 1 ? '' : 's'}.
          </p>
        )}
        {importStatus === 'error' && importResult && (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger)', margin: 0 }}>
            {importResult.message}
          </p>
        )}
      </div>
    </Card>
  );
}

export default DataExportImportCard;
