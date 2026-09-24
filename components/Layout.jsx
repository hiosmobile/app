import { useState } from "react";
import { Outlet } from "react-router-dom";
import { BottomNav, SideRail } from "./Navigation";
import FabMenu from "./FabMenu";
import "./layout.css";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet />
      </main>

      <SideRail onOpenMenu={() => setIsMenuOpen(true)} />
      <BottomNav onOpenMenu={() => setIsMenuOpen(true)} />

      <FabMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
}
