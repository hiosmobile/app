import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import RippleButton from '../../components/RippleButton';
import ScrollTop from '../assets/buttons/scrolltop.bmp';

export default function HotelActivities() {
    const [activeTab, setActiveTab] = useState('book');
    const navigate = useNavigate();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        const rootDiv = document.getElementById('root');
        if (rootDiv) rootDiv.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="container mt-4 mb-5">
            <Card className="full" bodyClass="text-start">
                <div className="top-container">
                    <h1 className="blue-h2">
                        <span className="titleIcon material-symbols-rounded">hotel</span>
                        Hotel
                    </h1>
                    <p className="subtitle mb-0">Staying at weB&B? Select an option from below to get started.</p>
                </div>
            </Card>

            <Card className="mt-2 joinTop" bodyClass="p-2">
                <div className="sub-nav-pills-header">
                    <button
                        className={`sub-header-tab ripple-button ${activeTab === 'book' ? 'active' : ''}`}
                        onClick={() => setActiveTab('book')}
                    >
                        Book a Room
                    </button>
                    <button
                        className={`sub-header-tab ripple-button ${activeTab === 'checkin' ? 'active' : ''}`}
                        onClick={() => setActiveTab('checkin')}
                    >
                        Check-In
                    </button>
                    <button
                        className={`sub-header-tab ripple-button ${activeTab === 'checkout' ? 'active' : ''}`}
                        onClick={() => setActiveTab('checkout')}
                    >
                        Check-Out
                    </button>
                </div>
            </Card>

            <div className="tab-content mt-2">
                {/* --- BOOK TAB CONTENT --- */}
                {activeTab === 'book' && (
                    <div className="fade show active">
                        <Card className="joinBottom text-center">
                            <h2 className="card-title">Book a Room</h2>
                            <p className="card-text">Book a room at weB&B below.</p>
                            <RippleButton className="form-button" onClick={() => navigate('/viewer', {
                                state: {
                                    src: "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAYAABORJhBUNzlCNkROOVc3UzJCTFQ1UVpWQ0pHQk9YSS4u&embed=true",
                                    title: "Book a Room"
                                }
                            })}>
                                <span className="form-button-icon material-symbols-rounded">fullscreen</span>Open Form Fullscreen
                            </RippleButton>
                            <div className="iframe-wrapper roundedImage mt-2">
                                <iframe 
                                    className="menu-iframe roundedImage" 
                                    src="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAYAABORJhBUNzlCNkROOVc3UzJCTFQ1UVpWQ0pHQk9YSS4u&embed=true" 
                                    frameBorder="0" 
                                    title="Book a Room Form"
                                >Loading...</iframe>
                            </div>
                            <div className="text-center">
                                <img 
                                    src={ScrollTop} 
                                    alt="Scroll Top" 
                                    className="mt-4 roundedImage" 
                                    style={{ cursor: 'pointer' }} 
                                    onClick={scrollToTop} 
                                    role="button"
                                />
                            </div>
                        </Card>
                    </div>
                )}

                {/* --- CHECK-IN TAB CONTENT --- */}
                {activeTab === 'checkin' && (
                    <div className="fade show active">
                        <Card className="joinBottom text-center">
                            <h2 className="card-title">Check-In</h2>
                            <p className="card-text">Welcome! Check in below. :)</p>
                            <RippleButton className="form-button" onClick={() => navigate('/viewer', {
                                state: {
                                    src: "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAYAABORJhBUQkJBVkZFSDhCOVJDMjdBRFQ2Sjc3NEM5MS4u&embed=true",
                                    title: "Check-In"
                                }
                            })}>
                                <span className="form-button-icon material-symbols-rounded">fullscreen</span>Open Form Fullscreen
                            </RippleButton>
                            <div className="iframe-wrapper roundedImage mt-2">
                                <iframe 
                                    className="menu-iframe roundedImage" 
                                    src="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAYAABORJhBUQkJBVkZFSDhCOVJDMjdBRFQ2Sjc3NEM5MS4u&embed=true" 
                                    frameBorder="0" 
                                    title="Check-In Form"
                                >Loading...</iframe>
                            </div>
                            <div className="text-center">
                                <img 
                                    src={ScrollTop} 
                                    alt="Scroll Top" 
                                    className="mt-4 roundedImage" 
                                    style={{ cursor: 'pointer' }} 
                                    onClick={scrollToTop} 
                                    role="button"
                                />
                            </div>
                        </Card>
                    </div>
                )}

                {/* --- CHECK-OUT TAB CONTENT --- */}
                {activeTab === 'checkout' && (
                    <div className="fade show active">
                        <Card className="joinBottom text-center">
                            <h2 className="card-title">Check-Out</h2>
                            <p className="card-text">Thank you for staying with us! Check out below. :)</p>
                            <RippleButton className="form-button" onClick={() => navigate('/viewer', {
                                state: {
                                    src: "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAYAABORJhBUMjdUUDRPMzg2OE9GOTRaQlNMUjJSUFdONS4u&embed=true",
                                    title: "Check-Out"
                                }
                            })}>
                                <span className="form-button-icon material-symbols-rounded">fullscreen</span>Open Form Fullscreen
                            </RippleButton>
                            <div className="iframe-wrapper roundedImage mt-2">
                                <iframe 
                                    className="menu-iframe roundedImage" 
                                    src="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAYAABORJhBUMjdUUDRPMzg2OE9GOTRaQlNMUjJSUFdONS4u&embed=true" 
                                    frameBorder="0" 
                                    title="Check-Out Form"
                                >Loading...</iframe>
                            </div>
                            <div className="text-center">
                                <img 
                                    src={ScrollTop} 
                                    alt="Scroll Top" 
                                    className="mt-4 roundedImage" 
                                    style={{ cursor: 'pointer' }} 
                                    onClick={scrollToTop} 
                                    role="button"
                                />
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </main>
    );
}