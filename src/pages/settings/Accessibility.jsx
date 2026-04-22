import React, { useContext } from "react";
import {
  PageHeader,
  InfoBubble,
  Card,
  Switch,
  Row,
  Col,
} from "../../../components/HiMaterial";
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
      <Row className="mb-2">
        <Col size={12}>
          <PageHeader
            icon="accessibility_new"
            title="Accessibility"
            subtitle="Adjust the ease of access of HiOS below."
          />
        </Col>
      </Row>

      <Row className="g-2">
        {/* Left column */}
        <Col size={12} md={6}>
          <Card title="Vision">
            <Switch
              label="High-contrast UI"
              checked={highContrastEnabled}
              onChange={handleHighContrastToggle}
              className="joinTop"
            />
            <InfoBubble
              icon="contrast"
              title="Increase legibility across HiOS."
              className="joinBottom"
            >
              This overrides theme colours with high-contrast alternatives and
              disables materials like ZenGlass.
            </InfoBubble>
          </Card>
        </Col>

        {/* Right column */}
        <div className="col-12 col-md-6">
          <Card>
            <InfoBubble
              icon="accessible_forward"
              title="At nuggetdev, we like to cater for everyone."
              className="full"
            >
              Not everyone has top notch vision. That's why we like to add stuff
              like a high-contrast UI, so that as many people can use our apps
              as physically possible.
            </InfoBubble>
          </Card>
        </div>
      </Row>
    </main>
  );
}
