import React, { useContext } from "react";
import TopBarWrapper from "../../../components/TopBarWrapper";
import { ThemeContext } from "../../../components/ThemeContext";

export default function Appearance() {
  const { appTheme, setAppTheme, accentColor, setAccentColor } =
    useContext(ThemeContext);

  const colors = [
    { id: "mango", hex: "#f09609" },
    { id: "cyan", hex: "#1ba1e2" },
    { id: "magenta", hex: "#ff0097" },
    { id: "green", hex: "#339933" },
    { id: "lime", hex: "#a4c400" },
    { id: "teal", hex: "#00aba9" },
    { id: "pink", hex: "#f472d0" },
    { id: "orange", hex: "#e3a21a" },
    { id: "blue", hex: "#2d62ed" },
    { id: "red", hex: "#e51400" },
    { id: "crimson", hex: "#a20025" },
    { id: "brown", hex: "#825a2c" },
  ];

  return (
    <TopBarWrapper title="appearance" hideTitle={true}>
      {/* THEME SECTION */}
      <div className="metro-settings-section metro-anim-list-item delay-2">
        <h3 className="metro-settings-label">background</h3>
        <div className="metro-settings-list">
          <button
            className={`settings-item ${appTheme === "dark" ? "active" : ""}`}
            onClick={() => setAppTheme("dark")}
          >
            <span className="item-title">dark</span>
            <span className="item-sub">the classic high-contrast look</span>
          </button>
          <button
            className={`settings-item ${appTheme === "light" ? "active" : ""}`}
            onClick={() => setAppTheme("light")}
          >
            <span className="item-title">light</span>
            <span className="item-sub">stark white and vibrant colors</span>
          </button>
        </div>
      </div>

      {/* ACCENT COLOR SECTION */}
      <div className="metro-settings-section metro-anim-list-item delay-3">
        <h3 className="metro-settings-label">accent color</h3>
        <p
          style={{
            color: "var(--subtext)",
            marginBottom: "20px",
            fontSize: "0.9rem",
          }}
        >
          choose a color for your tiles and buttons
        </p>

        <div className="metro-color-grid">
          {colors.map((color) => (
            <div
              key={color.id}
              className={`color-swatch ${accentColor === color.id ? "active" : ""}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => setAccentColor(color.id)}
            >
              <span className="material-symbols-sharp">check</span>
            </div>
          ))}
        </div>
      </div>
    </TopBarWrapper>
  );
}
