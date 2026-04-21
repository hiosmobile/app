import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../src/assets/ripple.css";

/**
 * RippleButton
 */
export const RippleButton = ({
  children,
  onClick,
  className = "",
  style = {},
  delay = 0,
}) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = { x, y, size, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    // If a delay is provided (for navigation), wait before firing the action
    if (onClick) {
      if (delay > 0) {
        setTimeout(() => onClick(e), delay);
      } else {
        onClick(e);
      }
    }

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 500);
  };

  return (
    <button
      className={`fluent-interactive ripple-button ${className}`}
      onClick={handleClick}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple-effect"
          style={{
            width: r.size,
            height: r.size,
            left: r.x,
            top: r.y,
            position: "absolute",
            pointerEvents: "none",
          }}
        />
      ))}
    </button>
  );
};

/**
 * Card
 */
export const Card = ({ title, children, className = "", bodyClass = "" }) => {
  const isJoining =
    className.includes("joinTop") ||
    className.includes("joinBottom") ||
    className.includes("joinMiddle");

  const baseClass = isJoining ? "card" : "card full";

  return (
    <motion.div
      className={`${baseClass} ${className}`.trim()}
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "16px",
      }}
    >
      <div className={`card-body ${bodyClass}`.trim()}>
        {title && <h5 className="card-title">{title}</h5>}
        {children}
      </div>
    </motion.div>
  );
};

/**
 * Back
 */
export const Back = ({ backPath }) => {
  const navigate = useNavigate();

  return (
    <Card className="joinTop" bodyClass="d-flex align-items-center p-2">
      <RippleButton
        delay={150}
        className="nav-icon-btn"
        onClick={() => navigate(backPath)}
        style={{ width: "40px", height: "40px", padding: 0 }}
      >
        <span className="material-symbols-rounded">arrow_back_ios</span>
      </RippleButton>
    </Card>
  );
};

/**
 * Row
 */
export const Row = ({ children, className = "" }) => {
  return <div className={`row ${className}`}>{children}</div>;
};

/**
 * Col
 */
export const Col = ({ children, size, md, className = "" }) => {
  // If size is "auto", use col-auto. If no size is provided, just use "col".
  const colClass = size === "auto" ? "col-auto" : size ? `col-${size}` : "col";
  const mdClass = md === "auto" ? "col-md-auto" : md ? `col-md-${md}` : "";

  return (
    <div className={`${colClass} ${mdClass} ${className}`}>{children}</div>
  );
};

/**
 * MenuActionBtn
 */
export const MenuActionBtn = ({ icon, text, className = "", onClick }) => {
  return (
    <RippleButton
      delay={150}
      className={`roundedImage button ${className}`.trim()}
      onClick={onClick}
    >
      <span className="material-symbols-rounded">{icon}</span>
      <span className="button-text">{text}</span>
    </RippleButton>
  );
};

/**
 * SubNavPills
 */
export const SubNavPills = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="sub-nav-pills-header">
      {tabs.map((tab) => (
        <RippleButton
          key={tab.id}
          className={`sub-header-tab ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </RippleButton>
      ))}
    </div>
  );
};

/**
 * Dropdown
 */
export const Dropdown = ({ value, onChange, options, disabled = false }) => {
  return (
    <select
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

/**
 * PageHeader
 */
export const PageHeader = ({ icon, title, subtitle, className = "" }) => {
  return (
    <Card className={className}>
      <div className="top-container">
        <h1 className="blue-h2">
          {icon && (
            <span className="titleIcon material-symbols-rounded">{icon}</span>
          )}
          {title}
        </h1>
        {subtitle && (
          <p id="para" className="subtitle mb-0">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
};

/**
 * PageNavHeader
 */

export const PageNavHeader = ({ backPath, tabs, activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="joinTop"
      bodyClass="d-flex align-items-center justify-content-between p-2"
    >
      <RippleButton
        delay={150}
        className="nav-icon-btn"
        onClick={() => navigate(backPath)}
        style={{ width: "40px", height: "40px", padding: 0 }}
      >
        <span className="material-symbols-rounded">arrow_back_ios</span>
      </RippleButton>

      <div className="nav-pills-header">
        {tabs.map((tab) => (
          <RippleButton
            key={tab.id}
            className={`header-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="material-symbols-rounded">{tab.icon}</span>
            <span className="tab-text">{tab.label}</span>
          </RippleButton>
        ))}
      </div>
    </Card>
  );
};

/**
 * ProgressWidget
 */
export const ProgressWidget = ({ icon, title, current, max, subtitle }) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="translucentAboutBox h-100 d-flex flex-column justify-content-center text-center p-2">
      <div className="card-body p-0">
        <span
          className="material-symbols-rounded mb-1"
          style={{ fontSize: "32px", color: "var(--primary)" }}
        >
          {icon}
        </span>
        <h6 className="fw-bold mb-2">{title}</h6>

        <div
          className="progress mx-auto mb-2"
          style={{
            height: "8px",
            width: "80%",
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: "10px",
          }}
        >
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${percentage}%`,
              backgroundColor: "var(--primary)",
              borderRadius: "10px",
            }}
          ></div>
        </div>

        <small className="d-block fw-bold mb-1">
          {current} / {max}
        </small>
        <small style={{ fontSize: "0.75rem", opacity: 0.8 }}>{subtitle}</small>
      </div>
    </div>
  );
};

/**
 * Switch
 */
export const Switch = ({ label, checked, onChange, disabled = false }) => {
  // We handle the event here so the parent doesn't have to
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className="switchContainer p-3">
      <div style={{ display: "flex", alignItems: "center" }}>
        <label
          className="form-check-label ms-2"
          style={{ marginRight: "auto" }}
        >
          {label}
        </label>
        <label className="switch" style={{ marginLeft: "auto" }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange} // Use the local handler
            disabled={disabled}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
};

/**
 * InfoBubble
 */
export const InfoBubble = ({ icon, title, children }) => {
  return (
    <div className="infoBubble" style={{ textAlign: "left" }}>
      {title && (
        <h4
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {icon && (
            <span className="material-symbols-rounded helpcenterIcons">
              {icon}
            </span>
          )}
          {title}
        </h4>
      )}

      {children && (
        <p
          style={{
            fontSize: "14px",
            margin: "8px 0 0 0",
            opacity: 0.8,
          }}
        >
          {children}
        </p>
      )}
    </div>
  );
};
