import React from 'react';
import Card from '../../components/Card';
import RippleButton from '../../components/RippleButton';
import Logo from '../assets/pics/logos/hiosbadge.png';

export default function Gateway() {
  return (
    <main 
      className="container" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '85vh' 
      }}
    >
      <Card className="text-center" style={{ maxWidth: '500px', width: '100%', padding: '10px' }}>

        <img src={Logo} alt="HiOSMobile Logo" style={{ width: '100px', marginBottom: '20px' }}/>
        
        <h1 className="gradientHeading mb-2">HiOSMobile</h1>
        <p className="subtitle mb-4" style={{ fontSize: '18px', opacity: 0.8, padding: '0 15px' }}>
          To access the platform, please download the native app or visit our web version.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <RippleButton 
            className="button roundedImage joinTop" 
            onClick={() => window.location.href = 'https://hienterprises.github.io/hiosmobile/home'}
          >
            <span className="material-symbols-rounded" style={{ float: 'right', marginRight: '15px' }}>
              download
            </span>
            <span className="button-text" style={{ marginLeft: '15px' }}>
              Download the App
            </span>
          </RippleButton>

          <RippleButton 
            className="button roundedImage joinBottom" 
            onClick={() => window.location.href = 'https://hiosmobile.github.io'}
          >
            <span className="material-symbols-rounded" style={{ float: 'right', marginRight: '15px' }}>
              language
            </span>
            <span className="button-text" style={{ marginLeft: '15px' }}>
              Visit Web Version
            </span>
          </RippleButton>
        </div>

      </Card>
    </main>
  );
}