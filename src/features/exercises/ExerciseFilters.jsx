import { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import SearchInput from '../../components/SearchInput';
import Button from '../../components/Button';
import MuscleGroupFilterModal from './MuscleGroupFilterModal';
import EquipmentFilterModal from './EquipmentFilterModal';
import { hasActiveFilters } from '../../utils/exerciseFilters';
import './ExerciseFilters.css';

function ExerciseFilters({
  exercises,
  searchValue,
  onSearchChange,
  filters,
  onFiltersChange,
  onOpenAdvanced,
  hasActiveAdvancedFilters,
}) {
  const [isMuscleModalOpen, setIsMuscleModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);

  const anyActive = hasActiveFilters(filters);

  const activeChips = [
    filters.muscleGroup && { label: filters.muscleGroup, onRemove: () => onFiltersChange({ ...filters, muscleGroup: null }) },
    filters.equipmentCategory && { label: filters.equipmentCategory, onRemove: () => onFiltersChange({ ...filters, equipmentCategory: null }) },
    filters.muscleGroupMain && { label: filters.muscleGroupMain, onRemove: () => onFiltersChange({ ...filters, muscleGroupMain: null }) },
    filters.muscleGroupSupport && { label: filters.muscleGroupSupport, onRemove: () => onFiltersChange({ ...filters, muscleGroupSupport: null }) },
    filters.difficulty && { label: filters.difficulty, onRemove: () => onFiltersChange({ ...filters, difficulty: null }) },
  ].filter(Boolean);

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

      <div className="exercise-filters-buttons">
        <Button
          variant={filters.muscleGroup ? 'primary' : 'secondary'}
          size="sm"
          icon={ChevronDown}
          onClick={() => setIsMuscleModalOpen(true)}
          style={{ flex: 1 }}
        >
          {filters.muscleGroup || 'Muscle Groups'}
        </Button>
        <Button
          variant={filters.equipmentCategory ? 'primary' : 'secondary'}
          size="sm"
          icon={ChevronDown}
          onClick={() => setIsEquipmentModalOpen(true)}
          style={{ flex: 1 }}
        >
          {filters.equipmentCategory || 'Equipment'}
        </Button>
        {anyActive && (
          <button
            type="button"
            className="exercise-filters-reset"
            onClick={() => onFiltersChange({ bodySection: null, muscleGroup: null, equipmentCategory: null, muscleGroupMain: null, muscleGroupSupport: null, difficulty: null })}
            aria-label="Clear all filters"
            title="Clear all filters"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {activeChips.length > 0 && (
        <div className="exercise-filters-active-chips">
          {activeChips.map((chip) => (
            <button key={chip.label} className="exercise-filters-active-chip" onClick={chip.onRemove}>
              {chip.label}
              <X size={12} />
            </button>
          ))}
        </div>
      )}

      <MuscleGroupFilterModal
        isOpen={isMuscleModalOpen}
        onClose={() => setIsMuscleModalOpen(false)}
        exercises={exercises}
        value={filters.muscleGroup}
        onChange={(muscleGroup) => onFiltersChange({ ...filters, muscleGroup })}
      />

      <EquipmentFilterModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
        exercises={exercises}
        value={filters.equipmentCategory}
        onChange={(equipmentCategory) => onFiltersChange({ ...filters, equipmentCategory })}
      />
    </div>
  );
}

export default ExerciseFilters;
