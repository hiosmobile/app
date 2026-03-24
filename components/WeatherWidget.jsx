import React, { useEffect } from 'react';

export default function WeatherWidget() {
  useEffect(() => {
    // Inject the weather script safely into the document
    const script = document.createElement('script');
    script.src = "https://srv1.weatherwidget.org/js/?id=ww_6b591a1444ddd";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up the script if the component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div 
      style={{ boxShadow: '0 5px 5px -5px grey', width: '100%' }} 
      className="roundedImage" 
      id="ww_6b591a1444ddd" 
      v='1.20' 
      loc='id' 
      a='{"t":"horizontal","lang":"en","ids":["wl8686"],"cl_bkg":"image","cl_font":"#FFFFFF","cl_cloud":"#FFFFFF","cl_persp":"#81D4FA","cl_sun":"#FFC107","cl_moon":"#FFC107","cl_thund":"#FF5722","sl_sot":"celsius","sl_ics":"one","font":"Arial"}'
    >
      Weather for the Following Location:{' '}
      <a href="https://2ua.org/gbr/lancaster/map/" id="ww_6b591a1444ddd_u" target="_blank" rel="noreferrer">
        Lancaster map, United Kingdom
      </a>
    </div>
  );
}