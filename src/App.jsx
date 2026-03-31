import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../components/ThemeContext';

import Gateway from './pages/Gateway';

import Home from './pages/Welcome';

import Restaurant from './pages/Restaurant';
import HiCafe from './pages/restaurant/HiCafe';
import Breakfast from './pages/restaurant/Breakfast';
import CafeFiesta from './pages/restaurant/CafeFiesta';
import Locations from './pages/restaurant/Locations';

import HotelActivities from './pages/HotelActivities';

import Roomkey from './pages/Roomkey';

import Appearance from './pages/settings/Appearance';

import FullscreenViewer from './pages/FullscreenViewer';

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Gateway />} />
          <Route path="/welcome" element={<Home />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/restaurant/hicafe" element={<HiCafe />} />
          <Route path="/restaurant/breakfast" element={<Breakfast />} />
          <Route path="/restaurant/cafefiesta" element={<CafeFiesta />} />
          <Route path="/restaurant/locations" element={<Locations />} />
          <Route path="/hotelactivities" element={<HotelActivities />} />
          <Route path="/roomkey" element={<Roomkey />} />
          <Route path="/settings/appearance" element={<Appearance />} />
          <Route path="/viewer" element={<FullscreenViewer />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}