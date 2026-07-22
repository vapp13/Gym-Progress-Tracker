import FilterChip from '../../components/FilterChip';
import { DATE_RANGES } from '../../utils/dateRangeFilter';
import './DateRangeFilter.css';

function DateRangeFilter({ value, onChange }) {
  return (
    <div className="date-range-filter">
      {DATE_RANGES.map((range) => (
        <FilterChip
          key={range.value}
          label={range.label}
          active={value === range.value}
          onClick={() => onChange(range.value)}
        />
      ))}
    </div>
  );
}

export default DateRangeFilter;
