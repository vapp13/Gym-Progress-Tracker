import './Button.css';

function Button({ variant = 'primary', size = 'md', icon: Icon, children, className = '', ...props }) {
  return (
    <button className={`btn btn-${variant} btn-${size} ${className}`} {...props}>
      {Icon && <Icon size={18} strokeWidth={2.25} />}
      {children}
    </button>
  );
}

export default Button;
