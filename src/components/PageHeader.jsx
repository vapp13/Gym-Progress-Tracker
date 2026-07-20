import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './PageHeader.css';

function PageHeader({ title, showBack = false, onBack, sticky = false, actions }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <div className={`page-header-bar ${sticky ? 'is-sticky' : ''}`}>
      {showBack ? (
        <button className="session-icon-btn" onClick={handleBack} aria-label="Back">
          <ArrowLeft size={18} />
        </button>
      ) : (
        <span className="page-header-bar-spacer" aria-hidden="true" />
      )}
      <div className="page-header-bar-right">
        <h1>{title}</h1>
        {actions && <div className="page-header-bar-actions">{actions}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
