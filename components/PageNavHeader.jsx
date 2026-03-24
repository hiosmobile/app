import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import RippleButton from './RippleButton';

export default function PageNavHeader({ backPath, tabs, activeTab, setActiveTab }) {
    const navigate = useNavigate();

    return (
        <Card className="joinTop" bodyClass="d-flex align-items-center justify-content-between p-2">
            
            <RippleButton className="nav-icon-btn" onClick={() => navigate(backPath)} style={{ width: '40px', height: '40px', padding: 0 }}>
                <span className="material-symbols-rounded">arrow_back_ios</span>
            </RippleButton>

            <div className="nav-pills-header">
                {tabs.map((tab) => (
                    <button key={tab.id} className={`header-tab ripple-button ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                        <span className="material-symbols-rounded">{tab.icon}</span>
                        <span className="tab-text">{tab.label}</span>
                    </button>
                ))}
            </div>

        </Card>
    );
}