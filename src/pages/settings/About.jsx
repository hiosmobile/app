import React, { useEffect, useState } from "react";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { PageHeader, Card, Row, Col, InfoBubble } from "../../../components/HiMaterial";
import logoNew from "../../assets/pics/logos/logo_new.png";
import pkg from "../../../package.json";

export default function About() {
  const [appVersion, setAppVersion] = useState("Loading...");

  useEffect(() => {
    const getVersion = async () => {
      // Check if we are running on a Native Device (Android/iOS)
      if (Capacitor.isNativePlatform()) {
        const info = await App.getInfo();
        setAppVersion(`${info.version} (${info.build})`);
      } else {
        // Fallback for Web/Browser using package.json
        setAppVersion(`${pkg.version}`);
      }
    };
    getVersion();
  }, []);

  return (
    <main className="container mt-4 mb-5">
      <Row>
        <Col size={12}>
          <PageHeader
            title="About"
            subtitle="Find out the technical details about HiOSMobile below."
            className="pb-3 joinTop"
          />
        </Col>
      </Row>

      <Row className="g-1">
        <Col size={12}>
          <Card className="joinMiddle">
            <img
              src={logoNew}
              width="300"
              className="img-fluid roundedImage"
              alt="New Logo"
            />
          </Card>
          <Card className="joinBottom">
            <InfoBubble className="full" title="HiOSMobile by The Highland Cafe™">
              <h5 className="card-title mb-0">Version</h5>
              <p className="card-text">{appVersion}</p>
              <hr></hr>
              <h5 className="card-title mb-0">HiMaterial Version</h5>
              <p className="card-text">7.1</p>
            </InfoBubble>
            <p className="mt-4 small mb-0">
              This webapp was made entirely with ReactJS.
            </p>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
