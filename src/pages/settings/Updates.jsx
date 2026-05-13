import React, { useEffect, useState } from "react";
import { App } from "@capacitor/app";
import TopBarWrapper from "../../../components/TopBarWrapper";
import { openExternalLink } from "../../utils/externalLink";

export default function Updates() {
  const [appVersion, setAppVersion] = useState("loading...");
  const [latestVersion, setLatestVersion] = useState("checking...");
  const [releaseUrl, setReleaseUrl] = useState("");

  useEffect(() => {
    const fetchVersions = async () => {
      // 1. Get current local app version
      try {
        const info = await App.getInfo();
        setAppVersion(`${info.version} (${info.build})`);
      } catch (error) {
        setAppVersion("web / dev mode");
      }

      // 2. Fetch the latest release from GitHub
      try {
        const response = await fetch(
          "https://api.github.com/repos/hiosmobile/app/releases/latest",
        );
        if (response.ok) {
          const data = await response.json();
          setLatestVersion(data.tag_name || "unknown");
          setReleaseUrl(data.html_url);
        } else {
          setLatestVersion("failed to fetch");
        }
      } catch (error) {
        setLatestVersion("offline");
      }
    };

    fetchVersions();
  }, []);

  const SettingItem = ({ title, subtitle, onClick, delay }) => (
    <div className={`metro-anim-list-item delay-${delay}`}>
      <button className="settings-item" onClick={onClick}>
        <span className="item-title">{title}</span>
        {subtitle && <span className="item-sub">{subtitle}</span>}
      </button>
    </div>
  );

  return (
    <TopBarWrapper title="updates" hideTitle={true}>
      {/* --- STATUS SECTION --- */}
      <div className="metro-settings-section metro-anim-list-item delay-2">
        <h3 className="metro-settings-label">version status</h3>

        <p
          style={{
            color: "var(--onBackground)",
            fontSize: "1.4rem",
            fontFamily: "var(--fontLight)",
            marginBottom: "5px",
          }}
        >
          current version
        </p>
        <p
          style={{
            color: "var(--subtext)",
            fontSize: "1rem",
            marginBottom: "25px",
            textTransform: "lowercase",
          }}
        >
          {appVersion}
        </p>

        <p
          style={{
            color: "var(--onBackground)",
            fontSize: "1.4rem",
            fontFamily: "var(--fontLight)",
            marginBottom: "5px",
          }}
        >
          latest available
        </p>
        <p
          style={{
            color: "var(--subtext)",
            fontSize: "1rem",
            marginBottom: "10px",
            textTransform: "lowercase",
          }}
        >
          {latestVersion}
        </p>
      </div>

      {/* --- ACTION SECTION --- */}
      <div className="metro-settings-section metro-anim-list-item delay-3">
        <h3 className="metro-settings-label">update sources</h3>

        <div className="metro-settings-list">
          <SettingItem
            delay="1"
            title="download .apk"
            subtitle="get the newest features and improvements directly from github."
            onClick={() => {
              if (releaseUrl) {
                openExternalLink(releaseUrl);
              } else {
                alert("release link is not available yet.");
              }
            }}
          />
        </div>

        <p
          style={{
            color: "var(--subtext)",
            marginTop: "20px",
            fontSize: "1rem",
            lineHeight: "1.4",
          }}
        >
          what are you waiting for? we pour love and heart into updating this
          app, and adding tonnes of beautiful new features!
        </p>
      </div>
    </TopBarWrapper>
  );
}
