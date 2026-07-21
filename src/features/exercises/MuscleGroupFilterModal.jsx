import Modal from '../../components/Modal';
import { BODY_SECTIONS, getMuscleGroupsBySection } from '../../utils/exerciseFilters';
import './BodySectionFilterModal.css';

function MuscleGroupFilterModal({ isOpen, onClose, exercises, value, onChange }) {
  const grouped = getMuscleGroupsBySection(exercises);

  const handleSelect = (muscle) => {
    onChange(value === muscle ? null : muscle);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Muscle Group">
      <div className="muscle-group-sections">
        {BODY_SECTIONS.map((section) => {
          const muscles = grouped[section];
          if (muscles.length === 0) return null;

          return (
            <div key={section} className="muscle-group-section">
              <h4 className="muscle-group-section-title">{section}</h4>
              <div className="body-section-list">
                {muscles.map((muscle) => (
                  <button
                    key={muscle}
                    className={`body-section-option ${value === muscle ? 'is-selected' : ''}`}
                    onClick={() => handleSelect(muscle)}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

export default MuscleGroupFilterModal;
