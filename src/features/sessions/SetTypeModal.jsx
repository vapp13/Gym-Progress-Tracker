import Modal from '../../components/Modal';
import Tooltip from '../../components/Tooltip';
import { SET_TYPES } from '../../utils/setTypes';
import './SetTypeModal.css';

function SetTypeModal({ isOpen, onClose, value, onChange }) {
  const handleSelect = (type) => {
    onChange(type);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Type">
      <div className="set-type-list">
        {SET_TYPES.map((type) => (
          <div key={type.value} className={`set-type-option ${value === type.value ? 'is-selected' : ''}`}>
            <button
              type="button"
              className="set-type-option-button"
              onClick={() => handleSelect(type.value)}
            >
              {type.color && <span className="set-type-option-dot" style={{ backgroundColor: type.color }} />}
              {type.label}
            </button>
            <Tooltip text={type.explanation} />
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default SetTypeModal;
