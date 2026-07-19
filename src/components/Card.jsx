import './Card.css';

function Card({ children, className = '', interactive = false, as, ...props }) {
  const Element = as || (interactive ? 'button' : 'div');
  return (
    <Element className={`card ${interactive ? 'card-interactive' : ''} ${className}`} {...props}>
      {children}
    </Element>
  );
}

export default Card;
