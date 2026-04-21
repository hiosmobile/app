import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopBarWrapper({ title, children }) {
  const navigate = useNavigate();

  return (
    <div className="top-bar-wrapper-container">
      {/* Top App Bar */}
      <div className="top-app-bar">
        <button className="back-button" onClick={() => navigate(-1)}>
          <i className="material-symbols-rounded">arrow_back_ios</i>
        </button>
        <h1 className="top-bar-title">{title}</h1>
      </div>

      {/* Your React Page Content goes here */}
      <div className="main-content">{children}</div>
    </div>
  );
}
