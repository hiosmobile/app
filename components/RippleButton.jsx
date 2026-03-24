import React, { useState } from 'react';

export default function RippleButton({ children, onClick, className = '', style = {} }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = { x, y, size, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
    if (onClick) onClick(e);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 500);
  };

  return (
    <button className={`fluent-interactive ripple-button ${className}`} onClick={handleClick} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {children}
      {ripples.map((r) => (
        <span key={r.id} className="ripple-effect" style={{ width: r.size, height: r.size, left: r.x, top: r.y, position: 'absolute' }} />
      ))}
    </button>
  );
}