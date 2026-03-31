import React, { useState } from 'react';
import Card from '../../components/Card';
import Back from '../../components/Back';
import RippleButton from '../../components/RippleButton';

export default function RoomKey() {
    // Application States: 'idle' | 'scanning' | 'success' | 'error'
    const [keyState, setKeyState] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Hardcoded for demo, but normally fetched from your auth/booking backend
    const roomNumber = "302"; 

    const handleUnlock = async () => {
        // Prevent clicking while already scanning
        if (keyState === 'scanning' || keyState === 'success') return;

        setErrorMessage('');
        
        // 1. Check if the device actually supports Web NFC (Android Chrome)
        if ('NDEFReader' in window) {
            try {
                setKeyState('scanning');
                const ndef = new window.NDEFReader();
                await ndef.scan();
                
                // When the phone successfully taps the door's NFC tag
                ndef.onreading = event => {
                    setKeyState('success');
                    // Lock the door again after 5 seconds
                    setTimeout(() => setKeyState('idle'), 5000); 
                };

                ndef.onreadingerror = () => {
                    setKeyState('error');
                    setErrorMessage('Failed to read the lock. Please try again.');
                    setTimeout(() => setKeyState('idle'), 3000);
                };
            } catch (error) {
                setKeyState('error');
                setErrorMessage(error.message || 'NFC permission denied.');
                setTimeout(() => setKeyState('idle'), 3000);
            }
        } else {
            // 2. iOS/Desktop Fallback: Simulate the unlocking sequence smoothly
            setKeyState('scanning');
            
            // Pretend it takes 1.5 seconds to read the door
            setTimeout(() => {
                setKeyState('success');
                
                // Relock after 4 seconds
                setTimeout(() => setKeyState('idle'), 4000);
            }, 1500);
        }
    };

    // Dynamic UI mapping based on the current state
    const uiConfig = {
        idle: {
            icon: 'contactless',
            title: 'Tap to Unlock',
            color: 'var(--primary)',
            pulse: false
        },
        scanning: {
            icon: 'sensors',
            title: 'Hold near door handle...',
            color: '#eab308', // Warning yellow
            pulse: true
        },
        success: {
            icon: 'lock_open',
            title: 'Unlocked!',
            color: '#22c55e', // Success green
            pulse: false
        },
        error: {
            icon: 'error',
            title: 'Error',
            color: 'var(--error, #ef4444)',
            pulse: false
        }
    };

    const currentUI = uiConfig[keyState];

    return (
        <main className="container mt-4 mb-5">
            {/* Inline style for the scanning pulse animation */}
            <style>
                {`
                    @keyframes nfcPulse {
                        0% { transform: scale(0.95); opacity: 0.8; }
                        50% { transform: scale(1.05); opacity: 1; }
                        100% { transform: scale(0.95); opacity: 0.8; }
                    }
                    .scanning-pulse {
                        animation: nfcPulse 1.5s infinite ease-in-out;
                    }
                `}
            </style>

            <Card className="joinBottom" bodyClass="text-start">
                <div className="top-container">
                    <h1 className="blue-h2 mb-0">
                        <span className="titleIcon material-symbols-rounded">key</span>
                        Room Key
                    </h1>
                </div>
            </Card>

            <Card className="mt-2 joinTop" bodyClass="text-center p-4">
                <div className="mb-4">
                    <h2 style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '0' }}>Your Room</h2>
                    <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--primary)', margin: '0' }}>
                        {roomNumber}
                    </h1>
                </div>

                {/* The Interactive Key Button */}
                <div 
                    className="mx-auto mb-4" 
                    style={{ 
                        width: '180px', 
                        height: '180px', 
                        borderRadius: '50%',
                        backgroundColor: 'color-mix(in srgb, var(--surfaceVarient) 40%, transparent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `4px solid ${currentUI.color}`,
                        transition: 'all 0.3s ease',
                        cursor: keyState === 'idle' ? 'pointer' : 'default'
                    }}
                    onClick={handleUnlock}
                >
                    <RippleButton 
                        style={{ width: '100%', height: '100%', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}
                    >
                        <span 
                            className={`material-symbols-rounded ${currentUI.pulse ? 'scanning-pulse' : ''}`}
                            style={{ 
                                fontSize: '80px', 
                                color: currentUI.color,
                                transition: 'color 0.3s ease'
                            }}
                        >
                            {currentUI.icon}
                        </span>
                    </RippleButton>
                </div>

                <h2 className="card-title" style={{ color: currentUI.color, transition: 'color 0.3s ease' }}>
                    {currentUI.title}
                </h2>
                
                {keyState === 'error' && (
                    <p className="card-text text-danger mt-2">{errorMessage}</p>
                )}
            </Card>

            <Card className="joinBottom" bodyClass="text-start p-3">
                <h6 className="card-text mb-0" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
                    <span className="material-symbols-rounded">info</span>
                    Ensure NFC is enabled to use your digital room key.
                </h6>
            </Card>

        </main>
    );
}