import './PageLoader.css';

function PageLoader() {
  return (
    <div className="page-loader" aria-live="polite">
      <span className="page-loader-spinner" />
    </div>
  );
}

export default PageLoader;
