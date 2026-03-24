import React from 'react';

export default function ProgressWidget({ icon, title, current, max, subtitle }) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="translucentAboutBox h-100 d-flex flex-column justify-content-center text-center p-2">
      <div className="card-body p-0">
        <span className="material-symbols-rounded mb-1" style={{ fontSize: '32px', color: 'var(--primary)' }}>
          {icon}
        </span>
        <h6 className="fw-bold mb-2">{title}</h6>
        
        <div className="progress mx-auto mb-2" style={{ height: '8px', width: '80%', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '10px' }}>
          <div className="progress-bar" role="progressbar" style={{ width: `${percentage}%`, backgroundColor: 'var(--primary)', borderRadius: '10px' }}></div>
        </div>
        
        <small className="d-block fw-bold mb-1">{current} / {max}</small>
        <small style={{ fontSize: '0.75rem', opacity: 0.8 }}>{subtitle}</small>
      </div>
    </div>
  );
}