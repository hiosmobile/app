import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/global.css';

export default function FabMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setIsOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  return (
    <>
      <button className="fab" onClick={() => setIsOpen(true)}>
        <i className="material-symbols-rounded">more_vert</i>
      </button>

      <div 
        className={`bottom-sheet-overlay ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(false)}
      ></div>

      <div className={`bottom-sheet ${isOpen ? 'open' : ''}`}>
        <div className="bottom-sheet-header">
          <h2>Menu</h2>
          <i 
            className="material-symbols-rounded" 
            style={{ cursor: 'pointer' }} 
            onClick={() => setIsOpen(false)}
          >
            close
          </i>
        </div>
        
        <button 
          className="sheet-button" 
          onClick={() => window.open('https://www.dropbox.com/scl/fo/7gmlnnjcau1np91ee83ht/h?rlkey=ifj506k3aal7ko7tfecy8oqyq&dl=0', '_blank')}
        >
          <i className="material-symbols-rounded">download_for_offline</i>
          Download Menus
        </button>
        
        <button 
          className="sheet-button" 
          onClick={() => handleNavigation('/settings')}
        >
          <i className="material-symbols-rounded">settings</i>
          Settings
        </button>

        <button 
          className="sheet-button" 
          onClick={() => handleNavigation('/help')}
        >
          <i className="material-symbols-rounded">help</i>
          Help
        </button>
      </div>
    </>
  );
}