import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import MenuActionBtn from '../../components/MenuActionBtn';

export default function Restaurant() {
  const navigate = useNavigate();

  return (
    <main className="container mt-4 mb-5">
      
      <Card>
        <div className="top-container">
          <h1 className="blue-h2">
            <span className="titleIcon material-symbols-rounded">restaurant</span>
            Food
          </h1>
          <p id="para" className="subtitle mb-0">Pick an action from below.</p>
        </div>
      </Card>

      <Card className="mt-2">
        <MenuActionBtn
          icon="local_cafe" 
          text="Your HiCafe™️ Visit" 
          className="joinTop" 
          onClick={() => navigate('/restaurant/hicafe')} 
        />
        
        <MenuActionBtn 
          icon="egg_alt" 
          text="Breakfast Check-In" 
          className="joinTop" 
          onClick={() => navigate('/restaurant/breakfast')} 
        />
        
        {/* Tonys placeholder (commented out in your original code)
        <RippleButton 
          className="full roundedImage button" 
          style={{ backgroundImage: "url('assets/pics/logos/tonys.png')", backgroundSize: '350px 110px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: '#100c0c' }} 
          onClick={() => navigate('/restaurant/tonys')} 
        />
        */}

        <MenuActionBtn 
          icon="coffee_maker" 
          text="CafeFiesta™️" 
          className="joinTop" 
          onClick={() => navigate('/restaurant/cafefiesta')} 
        />
        
        <MenuActionBtn 
          icon="pin_drop" 
          text="Locations" 
          className="joinBottom" 
          onClick={() => navigate('/restaurant/locations')} 
        />
      </Card>

    </main>
  );
}