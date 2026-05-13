import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PageHeader, Back } from "./HiMaterial";

const navItems = [
  { path: "/", icon: "home", label: "home" },
  { path: "/restaurant", icon: "restaurant", label: "eat" },
  { path: "/hotelactivities", icon: "hotel", label: "stay" },
  { path: "/hirewards", icon: "award_star", label: "rewards" },
];

// The unified Full-Screen System Hub (Replaces FabMenu entirely)
function SystemHub({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setIsOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 250); // Wait for the turnstile animation to complete
  };

  return (
    <div className={`metro-system-menu ${isOpen ? "open" : ""}`}>
      <div className="metro-system-content">
        <Back onClick={() => setIsOpen(false)} />
        <PageHeader title="more" subtitle="application settings and help" />

        <div className="metro-system-list">
          <button onClick={() => handleNavigation("/settings")}>
            settings
          </button>
          <button onClick={() => handleNavigation("/help")}>help center</button>
          <button onClick={() => handleNavigation("/help/feedback")}>
            send feedback
          </button>
        </div>
      </div>
    </div>
  );
}

export function BottomNav() {
  const [isSystemOpen, setIsSystemOpen] = useState(false);

  return (
    <>
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <NavLink
            key={`bottom-${item.path}`}
            to={item.path}
            className="nav-item"
          >
            {({ isActive }) => (
              <>
                <div className="icon-wrapper">
                  <span className="material-symbols-sharp">{item.icon}</span>
                </div>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Native System Menu Trigger */}
        {/* inside BottomNav or SideRail */}
        <button
          className="nav-item"
          onClick={() => setIsSystemOpen(true)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <div className="icon-wrapper">
            <span className="material-symbols-sharp">dashboard_customize</span>
          </div>
          <span>more</span>
        </button>
      </nav>

      {/* Renders the full-screen menu over the app when clicked */}
      <SystemHub isOpen={isSystemOpen} setIsOpen={setIsSystemOpen} />
    </>
  );
}

export function SideRail() {
  const [isSystemOpen, setIsSystemOpen] = useState(false);

  return (
    <>
      <aside className="side-rail">
        {navItems.map((item) => (
          <NavLink
            key={`side-${item.path}`}
            to={item.path}
            className="nav-item"
          >
            <div className="icon-wrapper">
              <span className="material-symbols-sharp">{item.icon}</span>
            </div>
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* Native System Menu Trigger */}
        <button
          className="nav-item"
          onClick={() => setIsSystemOpen(true)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <div className="icon-wrapper">
            <span className="material-symbols-sharp">dashboard_customize</span>
          </div>
          <span>more</span>
        </button>
      </aside>

      {/* Renders the full-screen menu over the app when clicked */}
      <SystemHub isOpen={isSystemOpen} setIsOpen={setIsSystemOpen} />
    </>
  );
}
