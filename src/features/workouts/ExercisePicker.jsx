import Modal from '../../components/Modal';
import ExerciseBrowser from '../exercises/ExerciseBrowser';

function ExercisePicker({ isOpen, onClose, onConfirm }) {
  const handleConfirm = (exercises) => {
    onConfirm(exercises);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Exercises">
      <ExerciseBrowser selectionMode onConfirmSelection={handleConfirm} />
    </Modal>
  );
}

export default ExercisePicker;
