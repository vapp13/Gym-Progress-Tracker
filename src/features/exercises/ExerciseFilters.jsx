import SearchInput from '../../components/SearchInput';
import FilterChip from '../../components/FilterChip';
import './ExerciseFilters.css';

function ExerciseFilters({
  exercises,
  searchValue,
  onSearchChange,
  activeMuscleGroup,
  onMuscleGroupChange,
}) {
  const muscleGroups = [...new Set(exercises.map((ex) => ex.muscleGroup))].sort();

  return (
    <div className="exercise-filters">
      <SearchInput
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search exercises..."
      />
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