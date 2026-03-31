import React, { useState } from 'react';
import Card from '../../../components/Card';
import Back from '../../../components/Back';
import RippleButton from '../../../components/RippleButton';
import ScrollTop from '../../assets/buttons/scrolltop.bmp';

export default function Breakfast() {
    const ScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        const rootDiv = document.getElementById('root');
        if (rootDiv) rootDiv.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="container mt-4 mb-5">
            <Back backPath="/restaurant" />

            <Card bodyClass="text-start">
                <div className="top-container">
                    <h1 className="blue-h2"><span className="titleIcon material-symbols-rounded">egg_alt</span>Check-In to Breakfast</h1>
                    <p className="subtitle mb-0">Use the form below to check-in breakfast.</p>
                </div>
            </Card>
            <Card className="mt-2 full">
                <RippleButton className="form-button">
                    <span className="form-button-icon material-symbols-rounded">fullscreen</span>Open Form Fullscreen
                </RippleButton>
                <div className="iframe-wrapper">
                    <iframe className="menu-iframe roundedImage" src="https://docs.google.com/forms/d/e/1FAIpQLSdjJ0yto-VHoTjDtkYlbvr4XjI2wwd_XN-g7vuRP9aNwF1wwg/viewform?embedded=true" width="100%" height="600" frameBorder="0">Loading...</iframe>
                </div>
                <img src={ScrollTop} alt="Scroll Top" className="mt-4 ripple-button roundedImage" style={{ cursor: 'pointer' }} onClick={ScrollToTop} />
            </Card>
        </main>
    )
}