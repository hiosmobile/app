import { Outlet } from "react-router-dom";
import { BottomNav, SideRail } from "./Navigation";

export default function Layout() {
  return (
    <>
      <SideRail />
      <Outlet />
      <BottomNav />
    </>
  );
}
