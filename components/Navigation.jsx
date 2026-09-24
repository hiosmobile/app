import { NavLink } from "react-router-dom";

const navItems = [
  { id: "home", path: "/", icon: "home", label: "Home" },
  { id: "eat", path: "/restaurant", icon: "restaurant", label: "Eat" },
  { id: "stay", path: "/hotelactivities", icon: "hotel", label: "Stay" },
  { id: "rewards", path: "/hirewards", icon: "award_star", label: "HiRewards" },
  { id: "more", path: "/profile", icon: "account_circle", label: "Profile" },
];

export function BottomNav({ onOpenMenu }) {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) =>
        item.isAction ? (
          <button
            key={item.id}
            type="button"
            className="nav-item nav-action-btn"
            onClick={onOpenMenu}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <div className="inactiveIcon">
              <i className="material-symbols-rounded">{item.icon}</i>
            </div>
          </button>
        ) : (
          <NavLink key={item.id} to={item.path} className="nav-item">
            {({ isActive }) => (
              <div className={isActive ? "activeIcon" : "inactiveIcon"}>
                <i className="material-symbols-rounded">{item.icon}</i>
              </div>
            )}
          </NavLink>
        )
      )}
    </nav>
  );
}

export function SideRail({ onOpenMenu }) {
  return (
    <div className="side-rail">
      <ul>
        {navItems.map((item) => (
          <li key={`top-${item.id}`}>
            {item.isAction ? (
              <button
                className="siderailActionBtn"
                type="button"
                onClick={onOpenMenu}
              >
                {item.label}
              </button>
            ) : (
              <NavLink to={item.path}>
                <span className="material-symbols-rounded">{item.icon}</span>
                {item.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
