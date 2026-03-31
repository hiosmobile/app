import React from 'react';
import Card from '../../../components/Card';
import Back from '../../../components/Back';
import ScrollTop from '../../assets/buttons/scrolltop.bmp';

export default function Locations() {
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
                    <h1 className="blue-h2">
                        <span className="titleIcon material-symbols-rounded">pin_drop</span>
                        Locations
                    </h1>
                    <p className="subtitle mb-0">Wanting to find all our branches? Look below at the map.</p>
                </div>
            </Card>

            <Card className="mt-2 full">
                <div className="iframe-wrapper roundedImage">
                    <iframe 
                        className="menu-iframe roundedImage" 
                        src="https://www.google.com/maps/d/embed?mid=1uifQD-IGknh0jPlri0xvZJ6WTnUOt2k&ehbc=2E312F&noprof=1"
                        title="Our Locations Map"
                        frameBorder="0"
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
        </main>
    );
}