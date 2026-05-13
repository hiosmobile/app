import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Back } from "./HiMaterial";

export default function FabMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setIsOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 250);
  };

  return (
    <>
      {/* 1. Icon updated to dashboard_customize */}
      <button className="metro-system-trigger" onClick={() => setIsOpen(true)}>
        <span className="material-symbols-sharp">dashboard_customize</span>
      </button>

      <div className={`metro-system-menu ${isOpen ? "open" : ""}`}>
        <div className="metro-system-content">
          <Back onClick={() => setIsOpen(false)} />

          {/* 2. Title updated to "more" */}
          <PageHeader title="more" subtitle="application settings and help" />

          <div className="metro-system-list">
            <button onClick={() => handleNavigation("/settings")}>
              settings
            </button>
            <button onClick={() => handleNavigation("/help")}>
              help center
            </button>
            <button onClick={() => handleNavigation("/help/feedback")}>
              send feedback
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
