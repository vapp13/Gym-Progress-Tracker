import Modal from './Modal';
import Button from './Button';
import './ConfirmModal.css';

function ConfirmModal({ isOpen, onClose, onConfirm, title = 'Are you sure?', message, confirmLabel = 'Confirm', confirmVariant = 'danger' }) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p style={{ margin: '0 0 var(--space-lg) 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
        {message}
      </p>
      <div className="confirm-modal-actions">
        <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>
          Cancel
        </Button>
        <Button variant={confirmVariant} onClick={handleConfirm} style={{ flex: 1 }}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
