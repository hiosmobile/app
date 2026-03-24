import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../components/ThemeContext';

import Gateway from './pages/Gateway';

import Home from './pages/Welcome';

import Restaurant from './pages/Restaurant';
import HiCafe from './pages/restaurant/HiCafe';

import Appearance from './pages/settings/Appearance';

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Gateway />} />
          <Route path="/welcome" element={<Home />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/restaurant/hicafe" element={<HiCafe />} />
          <Route path="/settings/appearance" element={<Appearance />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}