import React from "react";
import TopBarWrapper from "../../../components/TopBarWrapper";
import { openExternalLink } from "../../utils/externalLink";

export default function Apps() {
  const SettingItem = ({ title, subtitle, onClick, delay }) => (
    <div className={`metro-anim-list-item delay-${delay}`}>
      <button className="settings-item" onClick={onClick}>
        <span className="item-title">{title}</span>
        {subtitle && <span className="item-sub">{subtitle}</span>}
      </button>
    </div>
  );

  return (
    <TopBarWrapper title="apps" hideTitle={true}>
      {/* --- RECOMMENDED SECTION --- */}
      <div className="metro-settings-section metro-anim-list-item delay-3">
        <h3 className="metro-settings-label">recommended</h3>
        <div className="metro-settings-list">
          <SettingItem
            delay="1"
            title="hiosmusic"
            subtitle="your music, your vibe. check out our brand-new music app."
            onClick={() =>
              openExternalLink("https://github.com/aarjay123/hiosmusic")
            }
          />
        </div>
      </div>

      {/* --- MORE SECTION --- */}
      <div className="metro-settings-section metro-anim-list-item delay-4">
        <h3 className="metro-settings-label">more from us</h3>
        <div className="metro-settings-list">
          <SettingItem
            delay="1"
            title="apps by nuggetdev"
            subtitle="we've got many other software projects. go take a look!"
            onClick={() =>
              openExternalLink("https://hienterprises.github.io/nuggetdev/home")
            }
          />
        </div>
      </div>
    </TopBarWrapper>
  );
}
