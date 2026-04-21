import React from "react";

const InfoBubble = ({ icon, title, children }) => {
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

export default InfoBubble;
