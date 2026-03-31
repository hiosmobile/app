import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import RippleButton from './RippleButton';

export default function Back({ backPath }) {
    const navigate = useNavigate();

    return (
        <Card className="joinTop" bodyClass="d-flex align-items-center p-2">
            
            <RippleButton delay={150} className="nav-icon-btn" onClick={() => navigate(backPath)} style={{ width: '40px', height: '40px', padding: 0 }}>
                <span className="material-symbols-rounded">arrow_back_ios</span>
            </RippleButton>

        </Card>
    );
}