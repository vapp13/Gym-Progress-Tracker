import './Skeleton.css';

function Skeleton({ width = '100%', height = '16px', radius = 'var(--radius-sm)', style = {} }) {
  return (
    <span
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card skeleton-card">
      <Skeleton width="40%" height="14px" />
      <Skeleton width="70%" height="22px" style={{ marginTop: 10 }} />
      <Skeleton width="100%" height="10px" style={{ marginTop: 16 }} />
    </div>
  );
}

export default Skeleton;
