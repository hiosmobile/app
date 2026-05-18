import { Outlet } from "react-router-dom";
import { BottomNav, SideRail } from "./Navigation";
import FabMenu from "./FabMenu";
import "./layout.css";

export default function Layout() {
  return (
    <div className="app-container">
      {/* 1. Top/Side Navigation */}
      <SideRail />

      {/* 2. Scrollable Page Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* 3. Fixed / Floating Elements */}
      <BottomNav />
      <FabMenu />
    </div>
  );
}
