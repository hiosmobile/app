import { Outlet } from 'react-router-dom';
import { BottomNav, SideRail } from './Navigation';
import FabMenu from './FabMenu';

export default function Layout() {
    return (
        <div className="app-container">
            <SideRail />
            <main className="main-content">
                <Outlet />
                <FabMenu />
            </main>
            <BottomNav />
        </div>
    );
}