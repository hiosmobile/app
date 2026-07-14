import React, { useEffect, useState } from "react";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
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

  const isWeb = Capacitor.getPlatform() === "web";

  useEffect(() => {
    const fetchVersions = async () => {
      // 1. Get current local app version safely
      if (isWeb) {
        setAppVersion("Web Application");
      } else {
        try {
          const info = await App.getInfo();
          setAppVersion(`${info.version} (${info.build})`);
        } catch (error) {
          setAppVersion("Dev Mode / Unknown");
        }
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
  }, [isWeb]);

  return (
    <main className="container mt-4 mb-5">
      <Row className="mb-2">
        <Col size={12}>
          <PageHeader
            icon="system_update"
            title="Updates"
            subtitle={
              isWeb
                ? "You are running the web version, which is always up to date."
                : "Check your current app version and find the latest releases."
            }
          />
        </Col>
      </Row>

      <Row className="g-2">
        {/* Left Column: Version Information */}
        <Col size={12} md={6}>
          <Card title="Version Status">
            <InfoBubble
              icon={isWeb ? "language" : "smartphone"}
              title="Current Version"
              className="joinTop"
            >
              {appVersion}
              {isWeb && " (Always Up to Date)"}
            </InfoBubble>
            <InfoBubble
              icon="cloud_download"
              title="Latest Android Release"
              className="joinBottom m-0"
            >
              {latestVersion}
            </InfoBubble>
          </Card>
        </Col>

        {/* Right Column: Update Actions / Native Promo */}
        <Col size={12} md={6}>
          <Card title={isWeb ? "Get the Native App" : "Update Sources"}>
            <MenuActionBtn
              icon={isWeb ? "android" : "open_in_new"}
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
              icon={isWeb ? "install_mobile" : "system_update"}
              title={
                isWeb
                  ? "Take it on the go."
                  : "Go ahead, download our update."
              }
              className="joinBottom"
            >
              {isWeb
                ? "You are currently viewing the web version. Download the Android APK to get the full native experience on your device!"
                : "What are you waiting for? We pour love and heart into updating this app, and adding tonnes of beautiful new features!"}
            </InfoBubble>
          </Card>
        </Col>
      </Row>
    </main>
  );
}