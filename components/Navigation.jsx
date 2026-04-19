import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/", icon: "home", label: "Home" },
  { path: "/restaurant", icon: "restaurant", label: "Eat" },
  { path: "/hotelactivities", icon: "hotel", label: "Stay" },
  { path: "/hirewards", icon: "award_star", label: "HiRewards" },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink key={item.path} to={item.path} className="nav-item">
          {({ isActive }) => (
            <div className={isActive ? "activeIcon" : "inactiveIcon"}>
              <i className="material-symbols-rounded">{item.icon}</i>
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export function SideRail() {
  return (
    <>
      {/*Desktop top navigation*/}
      <div className="side-rail">
        <ul>
          {navItems.map((item) => (
            <li key={`top-${item.path}`}>
              <NavLink to={item.path}>
                <span className="material-symbols-rounded">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/*export function SideRail() {
  return (
    <aside className="side-rail">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className="nav-item"
          style={{ marginBottom: '30px' }}
        >
          {({ isActive }) => (
            <>
              <div className={isActive ? 'activeIcon' : 'inactiveIcon'}>
                <i className="material-symbols-rounded">{item.icon}</i>
              </div>
              <span style={{ fontSize: '12px', marginTop: '6px', fontWeight: '500' }}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </aside>
  );
}*/
