import Modal from '../../components/Modal';
import { getEquipmentCategories } from '../../utils/exerciseFilters';
import './BodySectionFilterModal.css';

function EquipmentFilterModal({ isOpen, onClose, exercises, value, onChange }) {
  const categories = getEquipmentCategories(exercises);

  const handleSelect = (category) => {
    onChange(value === category ? null : category);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Equipment">
      <div className="body-section-list">
        {categories.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            No equipment categories available yet.
          </p>
        )}
        {categories.map((category) => (
          <button
            key={category}
            className={`body-section-option ${value === category ? 'is-selected' : ''}`}
            onClick={() => handleSelect(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </Modal>
  );
}

export default EquipmentFilterModal;
