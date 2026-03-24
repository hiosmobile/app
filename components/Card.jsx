import React from 'react';

export default function Card({ title, children, className = '', bodyClass = '' }) {
  const isJoining = className.includes('joinTop') || className.includes('joinBottom') || className.includes('joinMiddle');
  
  const baseClass = isJoining ? 'card' : 'card full';

  return (
    <div className={`${baseClass} ${className}`.trim()}>
      <div className={`card-body ${bodyClass}`.trim()}>
        {title && <h5 className="card-title">{title}</h5>}
        {children}
      </div>
    </div>
  );
}