import React, { useState } from 'react';
import Card from '../../../components/Card';
import Back from '../../../components/Back';
import RippleButton from '../../../components/RippleButton';
import ScrollTop from '../../assets/buttons/scrolltop.bmp';

export default function CafeFiesta() {
    // State to manage which tab is currently active
    const [activeTab, setActiveTab] = useState('menu');

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        const rootDiv = document.getElementById('root');
        if (rootDiv) rootDiv.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="container mt-4 mb-5">
            <Back backPath="/restaurant" />

            <Card className="joinBottom" bodyClass="text-start">
                <div className="top-container">
                    <h1 className="blue-h2" style={{ fontFamily: "Playfair Display, serif" }}>CafeFiesta</h1>
                    <p className="subtitle mb-0" style={{ fontFamily: "Open Sans, sans-serif" }}>Welcome to the artisan coffee shop chain by The Highland Cafe™️.</p>
                </div>
            </Card>

            <Card className="mt-2 joinTop" bodyClass="p-2">
                <div className="sub-nav-pills-header">
                    <button
                        className={`sub-header-tab ripple-button ${activeTab === 'menu' ? 'active' : ''}`}
                        onClick={() => setActiveTab('menu')}
                    >
                        Menu
                    </button>
                    <button
                        className={`sub-header-tab ripple-button ${activeTab === 'order' ? 'active' : ''}`}
                        onClick={() => setActiveTab('order')}
                    >
                        Order
                    </button>
                </div>
            </Card>

            <div className="tab-content mt-2">
                
                {/* --- MENU TAB CONTENT --- */}
                {activeTab === 'menu' && (
                    <div className="fade show active">
                        <Card className="joinBottom text-center">
                            <h2 className="card-title" style={{ fontFamily: "Playfair Display, serif" }}>Menu</h2>
                            <RippleButton className="form-button">
                                <span className="form-button-icon material-symbols-rounded">fullscreen</span>Open Menu Fullscreen
                            </RippleButton>
                            <div className="iframe-wrapper roundedImage mt-2">
                                <iframe 
                                    className="menu-iframe roundedImage" 
                                    src="https://drive.google.com/file/d/1v6kWr813fKLS25FprgLu0sklpXpjB2Gy/preview" 
                                    frameBorder="0" 
                                    allow="autoplay"
                                    title="CafeFiesta Menu"
                                ></iframe>
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

                {/* --- ORDER TAB CONTENT --- */}
                {activeTab === 'order' && (
                    <div className="fade show active">
                        <Card className="joinBottom text-center">
                            <h2 className="card-title" style={{ fontFamily: "Playfair Display, serif" }}>Order</h2>
                            <RippleButton className="form-button">
                                <span className="form-button-icon material-symbols-rounded">fullscreen</span>Open Form Fullscreen
                            </RippleButton>
                            <div className="iframe-wrapper roundedImage mt-2">
                                <iframe 
                                    className="menu-iframe roundedImage" 
                                    src="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAYAABORJhBUQkdCUEhHOTJDMUpIRVVKRzBWNjdNVVQ3QS4u&embed=true" 
                                    frameBorder="0" 
                                    allow="autoplay"
                                    title="CafeFiesta Order Form"
                                ></iframe>
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