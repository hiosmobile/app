import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { id: "home", path: "/", icon: "home", label: "home" },
  { id: "eat", path: "/restaurant", icon: "restaurant", label: "eat" },
  { id: "stay", path: "/hotelactivities", icon: "hotel", label: "stay" },
  { id: "rewards", path: "/hirewards", icon: "award_star", label: "rewards" },
  { id: "more", path: "/profile", icon: "account_circle", label: "profile" },
];

export function BottomNav() {
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const location = useLocation();

  // 1. Reset scroll to the top & reveal nav whenever the route changes
  useEffect(() => {
    document.body.classList.remove("scroll-down");
    lastScrollY.current = 0;

    // Reset both window and your .main-content scroll container instantly
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [location.pathname]);

  // 2. Smooth, bounce-proof scroll direction listener
  useEffect(() => {
    const handleScroll = (e) => {
      if (window.innerWidth >= 768) {
        document.body.classList.remove("scroll-down");
        return;
      }

      const target = e.target;

      // Only listen to the main page scroller (.main-content) or the document itself
      const isMainScroller =
        target === document ||
        target === window ||
        (target instanceof Element && target.classList.contains("main-content"));

      if (!isMainScroller) return;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const scroller =
            target === document || target === window
              ? document.scrollingElement || document.documentElement
              : target;

          if (!scroller) {
            ticking.current = false;
            return;
          }

          const currentScrollY = scroller.scrollTop;
          const maxScrollY = scroller.scrollHeight - scroller.clientHeight;

          // Ignore iOS/Android rubber-band bounce at the top or bottom
          if (currentScrollY < 0 || (maxScrollY > 0 && currentScrollY > maxScrollY)) {
            ticking.current = false;
            return;
          }

          const delta = currentScrollY - lastScrollY.current;

          // Always show near the top of the page
          if (currentScrollY <= 30) {
            document.body.classList.remove("scroll-down");
          } else if (delta > 12 && currentScrollY > 60) {
            // Requires a deliberate 12px downward scroll past 60px to hide
            document.body.classList.add("scroll-down");
          } else if (delta < -10) {
            // Requires a 10px upward scroll to show
            document.body.classList.remove("scroll-down");
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, {
      capture: true,
      passive: true,
    });
    return () =>
      window.removeEventListener("scroll", handleScroll, { capture: true });
  }, []);

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
