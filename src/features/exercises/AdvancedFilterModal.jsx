import Modal from '../../components/Modal';
import FilterChip from '../../components/FilterChip';
import Button from '../../components/Button';
import { toArray } from '../../utils/textFormatting';
import './AdvancedFilterModal.css';

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', color: 'var(--color-success)' },
  { value: 'intermediate', label: 'Intermediate', color: 'var(--color-accent)' },
  { value: 'advanced', label: 'Advanced', color: 'var(--color-danger)' },
];

function getUniqueValues(exercises, field) {
  const values = new Set();
  exercises.forEach((ex) => toArray(ex[field]).forEach((v) => values.add(v)));
  return [...values].sort();
}

function AdvancedFilterModal({ isOpen, onClose, exercises, filters, onChange }) {
  const mainOptions = getUniqueValues(exercises, 'muscleGroupMain');
  const supportOptions = getUniqueValues(exercises, 'muscleGroupSupport');

  const handleMainSelect = (value) => {
    onChange({ ...filters, muscleGroupMain: filters.muscleGroupMain === value ? null : value });
  };

  const handleSupportSelect = (value) => {
    onChange({ ...filters, muscleGroupSupport: filters.muscleGroupSupport === value ? null : value });
  };

  const handleDifficultySelect = (value) => {
    onChange({ ...filters, difficulty: filters.difficulty === value ? null : value });
  };

  const handleClear = () => {
    onChange({ muscleGroupMain: null, muscleGroupSupport: null, difficulty: null });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Advanced Filters">
      <div className="advanced-filter">
        <div className="advanced-filter-section">
          <span className="advanced-filter-label">Difficulty</span>
          <div className="advanced-filter-chips">
            {DIFFICULTY_LEVELS.map((level) => (
              <FilterChip
                key={level.value}
                label={level.label}
                active={filters.difficulty === level.value}
                activeColor={level.color}
                onClick={() => handleDifficultySelect(level.value)}
              />
            ))}
          </div>
        </div>

        {mainOptions.length > 0 && (
          <div className="advanced-filter-section">
            <span className="advanced-filter-label">Main Muscle</span>
            <div className="advanced-filter-chips">
              {mainOptions.map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  active={filters.muscleGroupMain === option}
                  onClick={() => handleMainSelect(option)}
                />
              ))}
            </div>
          </div>
        )}

        {supportOptions.length > 0 && (
          <div className="advanced-filter-section">
            <span className="advanced-filter-label">Supporting Muscle</span>
            <div className="advanced-filter-chips">
              {supportOptions.map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  active={filters.muscleGroupSupport === option}
                  onClick={() => handleSupportSelect(option)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="advanced-filter-actions">
          <Button variant="secondary" onClick={handleClear} style={{ flex: 1 }}>
            Clear
          </Button>
          <Button variant="primary" onClick={onClose} style={{ flex: 1 }}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AdvancedFilterModal;
