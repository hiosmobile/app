import React, { useEffect, useState } from "react";
import { App } from "@capacitor/app";
import {
  PageHeader,
  Card,
  MenuActionBtn,
  Row,
  Col,
  InfoBubble,
} from "../../../components/HiMaterial";
import { openExternalLink } from "../../utils/externalLink";

export default function Updates() {
  const [appVersion, setAppVersion] = useState("Loading...");
  const [latestVersion, setLatestVersion] = useState("Checking...");
  const [releaseUrl, setReleaseUrl] = useState("");

  useEffect(() => {
    const fetchVersions = async () => {
      // 1. Get current local app version
      try {
        const info = await App.getInfo();
        setAppVersion(`${info.version} (${info.build})`);
      } catch (error) {
        setAppVersion("Web/Dev Mode");
      }

      // 2. Fetch the latest release from GitHub
      try {
        const response = await fetch(
          "https://api.github.com/repos/hiosmobile/app/releases/latest",
        );
        if (response.ok) {
          const data = await response.json();
          // GitHub tags usually look like "v1.2.3", this grabs that string
          setLatestVersion(data.tag_name || "Unknown");
          setReleaseUrl(data.html_url);
        } else {
          setLatestVersion("Failed to fetch");
        }
      } catch (error) {
        setLatestVersion("Offline");
      }
    };

    fetchVersions();
  }, []);

  return (
    <main className="container mt-4 mb-5">
      <Row className="mb-2">
        <Col size={12}>
          <PageHeader
            icon="system_update"
            title="Updates"
            subtitle="Check your current app version and find the latest releases."
          />
        </Col>
      </Row>

      <Row className="g-2">
        {/* Left Column: Version Information */}
        <Col size={12} md={6}>
          <Card title="Version Status">
            <InfoBubble
              icon="smartphone"
              title="Current Version"
              className="joinTop"
            >
              {appVersion}
            </InfoBubble>
            <InfoBubble
              icon="cloud_download"
              title="Latest Available"
              className="joinBottom m-0"
            >
              {latestVersion}
            </InfoBubble>
          </Card>
        </Col>

        {/* Right Column: Update Actions */}
        <Col size={12} md={6}>
          <Card title="Update Sources">
            <MenuActionBtn
              icon="open_in_new"
              text="Download .apk"
              className="joinTop"
              onClick={() => {
                if (releaseUrl) {
                  openExternalLink(releaseUrl);
                } else {
                  alert("Release link is not available yet.");
                }
              }}
            />
            <InfoBubble
              icon="system_update"
              title="Go ahead, download our update."
              className="joinBottom"
            >
              What are you waiting for? We pour love and heart into updating
              this app, and adding tonnes of beautiful new features!
            </InfoBubble>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
