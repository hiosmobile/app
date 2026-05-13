import React, { useContext } from "react";
import TopBarWrapper from "../../../components/TopBarWrapper";
import { Switch } from "../../../components/HiMaterial";
import { ThemeContext } from "../../../components/ThemeContext";

export default function Sync() {
  const { syncEnabled, setSyncEnabled } = useContext(ThemeContext);

  return (
    <TopBarWrapper title="sync" hideTitle={true}>
      {/* --- APPEARANCE SYNC SECTION --- */}
      <div className="metro-settings-section metro-anim-list-item delay-2">
        <h3 className="metro-settings-label">preferences</h3>

        <Switch
          label="sync hios appearance"
          checked={syncEnabled}
          onChange={setSyncEnabled}
        />

        <p
          style={{
            color: "var(--subtext)",
            marginTop: "20px",
            fontSize: "1rem",
            lineHeight: "1.4",
          }}
        >
          save your hios appearance preferences with your hiaccount so they
          auto-apply on all your devices. how fancy is that?!
        </p>
      </div>

      {/* --- INFO SECTION --- */}
      <div className="metro-settings-section metro-anim-list-item delay-3">
        <h3 className="metro-settings-label">coming soon</h3>

        <p
          style={{
            color: "var(--onBackground)",
            fontSize: "1.4rem",
            fontFamily: "var(--fontLight)",
            marginBottom: "10px",
          }}
        >
          this is cool, isn't it?!
        </p>
        <p
          style={{
            color: "var(--subtext)",
            fontSize: "1rem",
            lineHeight: "1.4",
            marginBottom: "25px",
          }}
        >
          something we think our loyal users deserve is to be able to sync all
          their preferences with their hiaccount. that's what accounts are for,
          right?
        </p>

        <p
          style={{
            color: "var(--onBackground)",
            fontSize: "1.4rem",
            fontFamily: "var(--fontLight)",
            marginBottom: "10px",
          }}
        >
          more ways to sync
        </p>
        <p
          style={{
            color: "var(--subtext)",
            fontSize: "1rem",
            lineHeight: "1.4",
          }}
        >
          we're still in the process of adding more ways to sync hios with your
          hiaccount, so watch this space. we plan to add a toggle for syncing
          your pinned dashboard apps very soon!
        </p>
      </div>
    </TopBarWrapper>
  );
}
