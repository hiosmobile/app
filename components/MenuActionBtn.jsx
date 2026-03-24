import React from 'react';
import RippleButton from './RippleButton';

export default function MenuActionBtn({ icon, text, className = '', onClick }) {
    return (
        <RippleButton className={`roundedImage button ${className}`.trim()} onClick={onClick}>
            <span className="material-symbols-rounded">{icon}</span>
            <span className="button-text">{text}</span>
        </RippleButton>
    )
}