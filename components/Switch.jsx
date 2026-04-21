import React from "react";

const Switch = ({ label, checked, onChange, disabled = false }) => {
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

export default Switch;
