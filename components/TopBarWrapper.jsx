import React from "react";
import { useNavigate } from "react-router-dom";
import { Back } from "./HiMaterial";

export default function TopBarWrapper({ title, children }) {
  return (
    <div className="metro-wrapper">
      {/* Fixed Metro Header:
          Replaces the floating pill with a stark, flat, typography-driven header.
      */}
      <header className="metro-top-header">
        <div className="metro-header-content">
          <Back backPath={-1} />
          <p className="metro-system-subtitle">hios settings</p>
          <h1 className="metro-page-title">{title?.toLowerCase()}</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="metro-wrapper-content">{children}</div>
    </div>
  );
}
