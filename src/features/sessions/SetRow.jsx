import './SetRow.css';

function SetRow({ setNumber, set, onChange }) {
  const handleField = (field, value) => {
    onChange({ ...set, [field]: value });
  };

  return (
    <div className={`set-row ${set.completed ? 'set-row-completed' : ''}`}>
      <span className="set-row-number">{setNumber}</span>

      <label className="set-row-field">
        <span>Reps</span>
        <input
          type="number"
          min="0"
          value={set.reps}
          onChange={(e) => handleField('reps', Number(e.target.value))}
        />
      </label>

      <label className="set-row-field">
        <span>Weight</span>
        <input
          type="number"
          min="0"
          step="0.5"
          value={set.weight}
          onChange={(e) => handleField('weight', Number(e.target.value))}
        />
      </label>

      <label className="set-row-checkbox">
        <input
          type="checkbox"
          checked={set.completed}
          onChange={(e) => handleField('completed', e.target.checked)}
          aria-label={`Mark set ${setNumber} done`}
        />
      </label>
    </div>
  );
}

export default SetRow;