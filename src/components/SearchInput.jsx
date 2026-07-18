import './SearchInput.css';

function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <input
      type="text"
      className="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
    />
  );
}

export default SearchInput;