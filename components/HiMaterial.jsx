import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const RippleButton = ({
  children,
  onClick,
  className = "",
  style = {},
  delay = 0,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (e) => {
    if (onClick) {
      if (delay > 0) setTimeout(() => onClick(e), delay);
      else onClick(e);
    }
  };

  return (
    <button
      className={`metro-tilt-btn ${className}`.trim()}
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      style={{
        ...style,
        transform: isPressed
          ? "perspective(400px) scale(0.96) rotateX(4deg)"
          : "perspective(400px) scale(1) rotateX(0deg)",
        transition: "transform 0.1s cubic-bezier(0.1, 0.9, 0.2, 1)",
        transformStyle: "preserve-3d",
        border: "none",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
};

export const Card = ({
  title,
  children,
  className = "",
  bodyClass = "",
  style = {},
}) => {
  return (
    <div
      className={`metro-card ${className}`.trim()}
      style={{
        backgroundColor: "var(--surface)",
        color: "var(--onBackground)",
        padding: "16px",
        marginBottom: "12px",
        ...style,
      }}
    >
      <div className={`card-body ${bodyClass}`.trim()}>
        {title && (
          <h5
            className="metro-tile-title mb-3"
            style={{ color: "var(--accent)" }}
          >
            {title}
          </h5>
        )}
        {children}
      </div>
    </div>
  );
};

/**
 * =========================================
 * UNIFIED METRO BACK BUTTON
 * =========================================
 * Perfectly consistent inline arrow.
 */
export const Back = ({ backPath, onClick }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick(); // Run custom function if provided (like closing a modal)
    } else if (backPath === -1) {
      navigate(-1); // Go back in browser history
    } else if (backPath) {
      navigate(backPath); // Go to specific route
    } else {
      navigate(-1); // Default to browser history
    }
  };

  return (
    <button className="metro-back-btn" onClick={handleBack}>
      <span className="material-symbols-sharp">arrow_back</span>
      <span>back</span>
    </button>
  );
};

export const Row = ({ children, className = "" }) => (
  <div className={`row ${className}`}>{children}</div>
);

export const Col = ({ children, size, md, className = "" }) => {
  const colClass = size === "auto" ? "col-auto" : size ? `col-${size}` : "col";
  const mdClass = md === "auto" ? "col-md-auto" : md ? `col-md-${md}` : "";
  return (
    <div className={`${colClass} ${mdClass} ${className}`}>{children}</div>
  );
};

export const MenuActionBtn = ({
  icon,
  text,
  subtitle,
  className = "",
  onClick,
}) => {
  return (
    <button className={`metro-list-btn ${className}`.trim()} onClick={onClick}>
      <div className="metro-list-icon-box">
        <span className="material-symbols-sharp" style={{ fontSize: "36px" }}>
          {icon}
        </span>
      </div>
      <div className="metro-list-text-group">
        <h3 className="metro-list-title">{text}</h3>
        {subtitle && <p className="metro-list-subtitle">{subtitle}</p>}
      </div>
    </button>
  );
};

export const SubNavPills = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        overflowX: "auto",
        paddingBottom: "10px",
        marginBottom: "20px",
      }}
    >
      {tabs.map((tab) => (
        <RippleButton
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            fontSize: activeTab === tab.id ? "3rem" : "2rem",
            fontFamily: "var(--fontLight)",
            color:
              activeTab === tab.id ? "var(--onBackground)" : "var(--subtext)",
            textTransform: "lowercase",
            letterSpacing: "-1px",
            transition: "all 0.2s ease",
          }}
        >
          {tab.label}
        </RippleButton>
      ))}
    </div>
  );
};

export const Dropdown = ({
  value,
  onChange,
  options,
  disabled = false,
  className = "",
}) => (
  <select
    className={`button ${className}`}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    style={{
      appearance: "none",
      borderRadius: 0,
      border: "2px solid var(--subtext)",
      backgroundColor: "transparent",
      color: "var(--onBackground)",
      padding: "12px",
    }}
  >
    {options.map((opt) => (
      <option
        key={opt.value}
        value={opt.value}
        style={{
          background: "var(--background)",
          color: "var(--onBackground)",
        }}
      >
        {opt.label}
      </option>
    ))}
  </select>
);

export const PageHeader = ({ icon, title, subtitle, className = "" }) => (
  <div className={className} style={{ marginBottom: "30px" }}>
    <h1 className="metro-page-header" style={{ marginBottom: "5px" }}>
      {icon && (
        <span
          className="material-symbols-sharp"
          style={{ marginRight: "10px", fontSize: "inherit" }}
        >
          {icon}
        </span>
      )}
      {title}
    </h1>
    {subtitle && (
      <p
        style={{
          color: "var(--accent)",
          textTransform: "uppercase",
          fontWeight: 600,
          letterSpacing: "1px",
          margin: 0,
        }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

// Updated to use the new Back component
export const PageNavHeader = ({ backPath, tabs, activeTab, setActiveTab }) => (
  <div>
    <Back backPath={backPath} />
    <SubNavPills
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  </div>
);

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
      className={`metro-tile ${className}`.trim()}
      style={{
        cursor: "default",
        border: "2px solid var(--accent)",
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "15px",
        }}
      >
        <span
          className="material-symbols-sharp"
          style={{ fontSize: "28px", color: "var(--accent)" }}
        >
          {icon}
        </span>
        <h6
          style={{
            margin: 0,
            textTransform: "lowercase",
            fontWeight: 600,
            color: "var(--accent)",
          }}
        >
          {title}
        </h6>
      </div>
      <div
        style={{
          width: "100%",
          height: "8px",
          backgroundColor: "var(--surface)",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: "var(--accent)",
          }}
        ></div>
      </div>
      <small style={{ display: "block", fontWeight: "bold" }}>
        {current} / {max}
      </small>
      <small style={{ color: "var(--subtext)" }}>{subtitle}</small>
    </div>
  );
};

export const Switch = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
}) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
        borderBottom: "1px solid var(--surface)",
      }}
    >
      <label
        style={{
          fontSize: "1.2rem",
          fontFamily: "var(--fontLight)",
          textTransform: "lowercase",
          color: disabled ? "var(--subtext)" : "var(--onBackground)",
        }}
      >
        {label}
      </label>
      <div
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: "50px",
          height: "24px",
          border: `2px solid ${checked ? "var(--accent)" : "var(--subtext)"}`,
          backgroundColor: checked ? "var(--accent)" : "transparent",
          position: "relative",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transition: "all 0.2s",
        }}
      >
        <div
          style={{
            width: "12px",
            height: "16px",
            backgroundColor: checked ? "#fff" : "var(--subtext)",
            position: "absolute",
            top: "2px",
            left: checked ? "32px" : "4px",
            transition: "all 0.2s",
          }}
        />
      </div>
    </div>
  );
};

export const InfoBubble = ({ icon, title, children, className = "" }) => (
  <div
    className={className}
    style={{
      borderLeft: "4px solid var(--accent)",
      padding: "12px 16px",
      backgroundColor: "var(--surface)",
      marginBottom: "16px",
    }}
  >
    {title && (
      <h4
        style={{
          margin: "0 0 8px 0",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "16px",
          textTransform: "lowercase",
        }}
      >
        {icon && (
          <span
            className="material-symbols-sharp"
            style={{ color: "var(--accent)" }}
          >
            {icon}
          </span>
        )}
        {title}
      </h4>
    )}
    {children && (
      <p style={{ margin: 0, fontSize: "14px", color: "var(--subtext)" }}>
        {children}
      </p>
    )}
  </div>
);

export const TextInput = ({ className = "", ...props }) => (
  <input
    className={`button ${className}`.trim()}
    style={{ textAlign: "left", cursor: "text", textTransform: "none" }}
    {...props}
  />
);

export const GoogleAuthButton = ({
  text = "Sign in with Google",
  onClick,
  disabled = false,
  className = "",
}) => (
  <button
    type="button"
    className={`button ${className}`.trim()}
    onClick={onClick}
    disabled={disabled}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      border: "2px solid var(--subtext) !important",
    }}
  >
    <svg width="24" height="24" viewBox="0 0 48 48">
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
    </svg>
    <span
      style={{
        textTransform: "none",
        fontFamily: "var(--fontPrimary)",
        fontWeight: 400,
      }}
    >
      {text}
    </span>
  </button>
);

export const Modal = ({ isOpen, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="metro-popup-overlay">
      <div className="metro-popup-content">
        {title && <h2 className="metro-popup-header">{title}</h2>}
        <div className="metro-popup-body">{children}</div>
      </div>
    </div>
  );
};

export const ProfileHeader = ({ name, email, className = "" }) => (
  <div
    className={className}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "20px",
      marginBottom: "30px",
    }}
  >
    <div
      style={{
        width: "80px",
        height: "80px",
        backgroundColor: "var(--accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        className="material-symbols-sharp"
        style={{ fontSize: "40px", color: "#fff" }}
      >
        person
      </span>
    </div>
    <div>
      <h2
        style={{
          margin: 0,
          fontSize: "2rem",
          fontFamily: "var(--fontLight)",
          textTransform: "lowercase",
        }}
      >
        {name || "user"}
      </h2>
      <p style={{ margin: 0, color: "var(--subtext)" }}>{email}</p>
    </div>
  </div>
);
