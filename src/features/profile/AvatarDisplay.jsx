import './AvatarDisplay.css';

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function AvatarDisplay({ photoURL, name, size = 40 }) {
  const style = { width: size, height: size, fontSize: size * 0.4 };

  if (photoURL) {
    return <img src={photoURL} alt="" className="avatar-display" style={style} />;
  }

  return (
    <div className="avatar-display avatar-display-fallback" style={style}>
      {getInitials(name)}
    </div>
  );
}

export default AvatarDisplay;
