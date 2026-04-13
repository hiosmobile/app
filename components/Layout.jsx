import { Outlet } from "react-router-dom";
import { BottomNav, SideRail } from "./Navigation";
import FabMenu from "./FabMenu";
import "./layout.css";

export default function Layout() {
  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet />
        <FabMenu />
      </main>
      <SideRail />
      <BottomNav />
    </div>
  );
}
