import React from 'react';

export default function SubNavPills({ tabs, activeTab, setActiveTab }) {
    return (
        <div className="sub-nav-pills-header">
            {tabs.map((tab) => (
                <Button key={tab.id} className={`sub-header-tab ripple-button ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                    {tab.label}
                </Button>
            ))}
        </div>
    );
}