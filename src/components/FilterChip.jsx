import './FilterChip.css';

function FilterChip({ label, active, onClick, activeColor }) {
  const style = active && activeColor
    ? { backgroundColor: activeColor, borderColor: activeColor, boxShadow: 'none' }
    : undefined;

  return (
    <button
      type="button"
      className={`filter-chip ${active ? 'filter-chip-active' : ''}`}
      style={style}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export default FilterChip;
