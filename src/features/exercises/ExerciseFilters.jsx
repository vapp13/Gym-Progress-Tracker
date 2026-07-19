import { SlidersHorizontal } from 'lucide-react';
import SearchInput from '../../components/SearchInput';
import FilterChip from '../../components/FilterChip';
import './ExerciseFilters.css';

function ExerciseFilters({
  exercises,
  searchValue,
  onSearchChange,
  activeMuscleGroup,
  onMuscleGroupChange,
  onOpenAdvanced,
  hasActiveAdvancedFilters,
}) {
  const muscleGroups = [...new Set(exercises.map((ex) => ex.muscleGroup))].sort();

  return (
    <div className="exercise-filters">
      <div className="exercise-filters-search-row">
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search exercises..."
        />
        <button
          type="button"
          className="advanced-filter-trigger"
          onClick={onOpenAdvanced}
          aria-label="Advanced filters"
        >
          <SlidersHorizontal size={18} />
          {hasActiveAdvancedFilters && <span className="advanced-filter-dot" aria-hidden="true" />}
        </button>
      </div>
      <div className="filter-chip-row">
        <FilterChip
          label="All"
          active={activeMuscleGroup === null}
          onClick={() => onMuscleGroupChange(null)}
        />
        {muscleGroups.map((group) => (
          <FilterChip
            key={group}
            label={group}
            active={activeMuscleGroup === group}
            onClick={() => onMuscleGroupChange(group)}
          />
        ))}
      </div>
    </div>
  );
}

export default ExerciseFilters;
