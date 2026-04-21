import React, { useContext } from "react";
import PageHeader from "../../../components/PageHeader";
import InfoBubble from "../../../components/InfoBubble";
import Card from "../../../components/Card";
import Switch from "../../../components/Switch";
import { ThemeContext } from "../../../components/ThemeContext";

export default function Accessibility() {
  const {
    highContrastEnabled,
    setHighContrastEnabled,
    backgroundEnabled,
    setBackgroundEnabled,
    acrylicEnabled,
    setAcrylicEnabled,
  } = useContext(ThemeContext);

  const handleHighContrastToggle = (isChecked) => {
    setHighContrastEnabled(isChecked);

    if (isChecked) {
      // Backup current appearance settings before disabling them
      localStorage.setItem("hiosBackupBackground", backgroundEnabled);
      localStorage.setItem("hiosBackupAcrylic", acrylicEnabled);

      // Turn off background and acrylic for high contrast mode
      setBackgroundEnabled(false);
      setAcrylicEnabled(false);
    } else {
      // Restore previous settings when turning high contrast off
      const prevBackground =
        localStorage.getItem("hiosBackupBackground") !== "false";
      const prevAcrylic = localStorage.getItem("hiosBackupAcrylic") !== "false";

      setBackgroundEnabled(prevBackground);
      setAcrylicEnabled(prevAcrylic);
    }
  };

  return (
    <main className="container mt-4 mb-5">
      <div className="row mb-2">
        <div className="col-12">
          <PageHeader
            icon="accessibility_new"
            title="Accessibility"
            subtitle="Adjust the ease of access of HiOS below."
          />
        </div>
      </div>

      <div className="row g-2">
        {/* Left column */}
        <div className="col-12 col-md-6">
          <Card title="Vision">
            <Switch
              label="High-contrast UI"
              checked={highContrastEnabled}
              onChange={handleHighContrastToggle}
            />
            <InfoBubble
              icon="contrast"
              title="Increase legibility across HiOS."
            >
              This overrides theme colours with high-contrast alternatives and
              disables materials like ZenGlass.
            </InfoBubble>
          </Card>
        </div>

        {/* Right column */}
        <div className="col-12 col-md-6">
          <Card>
            <h3>At nuggetdev, we like to cater to everyone.</h3>
            <p>
              Not everyone has perfect vision. That's why we like to add stuff
              like a high-contrast UI, so that as many people can use our apps
              as physically possible.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
