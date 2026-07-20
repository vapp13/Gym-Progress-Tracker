import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import './Tooltip.css';

function Tooltip({ text }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!text) return null;

  return (
    <span className="tooltip-wrapper">
      <button
        type="button"
        className="tooltip-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onBlur={() => setIsOpen(false)}
        aria-label="More information"
        aria-expanded={isOpen}
      >
        <HelpCircle size={14} />
      </button>
      {isOpen && (
        <span className="tooltip-bubble" role="tooltip">
          {text}
        </span>
      )}
    </span>
  );
}

export default Tooltip;
