import Tooltip from '../../components/Tooltip';

function GoalMetricsFields({ typeConfig, metrics, customUnit, onChange, onUnitChange }) {
  const handleField = (field, value) => onChange({ ...metrics, [field]: value === '' ? '' : Number(value) });

  const { fields, unit, hasWeeklyTarget, hasCustomUnit, help } = typeConfig;
  const displayUnit = hasCustomUnit ? (customUnit || '') : unit;

  return (
    <>
      {hasCustomUnit && (
        <label className="form-field">
          <span>
            What are you measuring?
            <Tooltip text={help?.customUnit} />
          </span>
          <input
            type="text"
            placeholder='e.g. "5K time (min)", "km"'
            value={customUnit || ''}
            onChange={(e) => onUnitChange(e.target.value)}
          />
        </label>
      )}

      {fields.start && (
        <label className="form-field">
          <span>
            {fields.start} {displayUnit && `(${displayUnit})`}
            <Tooltip text={help?.start} />
          </span>
          <input
            type="number"
            step="0.1"
            value={metrics.start ?? ''}
            onChange={(e) => handleField('start', e.target.value)}
          />
        </label>
      )}

      {fields.current && (
        <label className="form-field">
          <span>
            {fields.current} {displayUnit && `(${displayUnit})`}
            <Tooltip text={help?.current} />
          </span>
          <input
            type="number"
            step="0.1"
            value={metrics.current ?? ''}
            onChange={(e) => handleField('current', e.target.value)}
          />
        </label>
      )}

      {fields.target && (
        <label className="form-field">
          <span>
            {fields.target} {displayUnit && `(${displayUnit})`}
            <Tooltip text={help?.target} />
          </span>
          <input
            type="number"
            step="0.1"
            value={metrics.target ?? ''}
            onChange={(e) => handleField('target', e.target.value)}
          />
        </label>
      )}

      {hasWeeklyTarget && (
        <label className="form-field">
          <span>Weekly target (optional, {unit}/week)</span>
          <input
            type="number"
            step="0.1"
            value={metrics.weeklyTarget ?? ''}
            onChange={(e) => handleField('weeklyTarget', e.target.value)}
          />
        </label>
      )}
    </>
  );
}

export default GoalMetricsFields;
