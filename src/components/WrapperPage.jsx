import React, { useState, useEffect } from 'react';

export default function WrapperPage({ src, title }) {
    const [isOnline, setIsOnline] = useState(window.navigator.onLine);

    useEffect(() => {
        const handleStatus = () => setIsOnline(window.navigator.onLine);
        
        window.addEventListener('online', handleStatus);
        window.addEventListener('offline', handleStatus);

        return () => {
            window.removeEventListener('online', handleStatus);
            window.removeEventListener('offline', handleStatus);
        };
    }, []);

    if (!isOnline) {
        return (
            <div className="offline-container">
                <span className="material-symbols-outlined offline-icon">
                    cloud_off
                </span>
                <h2 className="offline-title">You're Offline</h2>
                <p className="offline-text">This content requires an internet connection.</p>
                <button 
                    className="offline-button"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <iframe
            src={src}
            title={title}
            style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block'
            }}
        />
    );
}