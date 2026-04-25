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
    className.includes("joinMiddle") ||
    className.includes("joinLeft") ||
    className.includes("joinRight");

  // If NOT joining, add "full" class.
  // If it IS joining, we only use "card" so it doesn't fight the "full" radius.
  const baseClass = isJoining ? "card" : "card full";

  return (
    <motion.div
      className={`${baseClass} ${className}`.trim()}
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
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
export const Dropdown = ({
  value,
  onChange,
  options,
  disabled = false,
  className = "",
}) => {
  return (
    <select
      className={`form-select ${className}`}
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

export const PageNavHeader = ({
  backPath,
  tabs,
  activeTab,
  setActiveTab,
  className = "",
}) => {
  const navigate = useNavigate();

  return (
    <Card
      // We merge joinTop with any other classes passed in
      className={`joinTop ${className}`.trim()}
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
export const ProgressWidget = ({
  icon,
  title,
  current,
  max,
  subtitle,
  className = "",
}) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div
      className={`translucentAboutBox h-100 d-flex flex-column justify-content-center text-center p-2 ${className}`.trim()}
    >
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
export const Switch = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
}) => {
  // We handle the event here so the parent doesn't have to
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={`switchContainer p-3 ${className}`}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label className="form-check-label" style={{ marginRight: "auto" }}>
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
export const InfoBubble = ({ icon, title, children, className = "" }) => {
  return (
    // We combine the base 'infoBubble' class with any passed-in classes
    // .trim() just makes sure there isn't a trailing space if no class is passed
    <div
      className={`infoBubble ${className}`.trim()}
      style={{ textAlign: "left" }}
    >
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

/**
 * TextInput
 */
export const TextInput = ({ className = "", ...props }) => {
  const isJoining =
    className.includes("joinTop") ||
    className.includes("joinBottom") ||
    className.includes("joinMiddle") ||
    className.includes("joinLeft") ||
    className.includes("joinRight");

  const baseClass = isJoining ? "loginInput" : "loginInput full";

  return <input className={`${baseClass} ${className}`.trim()} {...props} />;
};

/**
 * GoogleAuthButton
 */
export const GoogleAuthButton = ({
  text = "Sign in with Google",
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type="button"
      className={`gsi-material-button ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="gsi-material-button-state"></div>
      <div className="gsi-material-button-content-wrapper">
        <div className="gsi-material-button-icon">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            style={{ display: "block" }}
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
        </div>
        <span className="gsi-material-button-contents">{text}</span>
        <span style={{ display: "none" }}>{text}</span>
      </div>
    </button>
  );
};

/**
 * Modal
 */
export const Modal = ({ isOpen, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "15px",
      }}
    >
      <Card className="full p-4" style={{ maxWidth: "450px", width: "100%" }}>
        {title && (
          <h2
            className="card-title mb-3"
            style={{ fontSize: "1.5rem", textAlign: "left" }}
          >
            {title}
          </h2>
        )}
        {children}
      </Card>
    </div>
  );
};

/**
 * ProfileHeader
 */
export const ProfileHeader = ({ name, email, className = "" }) => {
  return (
    <Card
      className={`text-center ${className}`.trim()}
      bodyClass="p-0"
      style={{ overflow: "hidden" }}
    >
      {/* Decorative top background */}
      <div
        style={{
          height: "80px",
          backgroundColor: "var(--primary)",
          opacity: 0.15,
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      ></div>

      <div className="card-body position-relative z-1 pt-4 pb-4">
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            backgroundColor: "var(--surface)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "4px solid var(--primaryContainer)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            margin: "0 auto 15px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "45px" }}
          >
            person
          </span>
        </div>
        <h2
          className="card-title mb-1"
          style={{ fontSize: "1.5rem", fontWeight: "bold" }}
        >
          {name || "HiOS User"}
        </h2>
        <p className="mb-0" style={{ opacity: 0.7, fontSize: "0.95rem" }}>
          {email}
        </p>
      </div>
    </Card>
  );
};
