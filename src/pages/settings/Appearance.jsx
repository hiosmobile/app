import React, { useContext, useState } from "react";
import {
  PageHeader,
  InfoBubble,
  Card,
  Switch,
  Dropdown,
  MenuActionBtn,
  Row,
  Col,
} from "../../../components/HiMaterial";
import { ThemeContext } from "../../../components/ThemeContext";
import { openExternalLink } from "../../utils/externalLink";

export default function Appearance() {
  const {
    backgroundEnabled,
    setBackgroundEnabled,
    acrylicEnabled,
    setAcrylicEnabled,
    autoColor,
    setAutoColor,
    wallpaperTheme,
    setWallpaperTheme,
    genericColor,
    setGenericColor,
    darkModePref,
    setDarkModePref,
  } = useContext(ThemeContext);

  const [activeMainTab, setActiveMainTab] = useState("themes");

  const mainTabs = [
    { id: "themes", label: "Themes" },
    { id: "advanced", label: "Advanced" },
  ];

  const effectiveAuto = backgroundEnabled ? autoColor : false;

  const glassThemes = [
    { value: "default", label: "Montenegrin Lake" },
    { value: "dobrota", label: "Dobrota" },
    { value: "spain", label: "Montefrío" },
    { value: "almeria", label: "Almeria" },
    { value: "france", label: "Terrasson" },
    { value: "turkey", label: "Tlos" },
    { value: "morocco", label: "Dades Gorge" },
    { value: "clouds", label: "Cloudy Sunrise" },
    { value: "london", label: "Tower Bridge" },
    { value: "yorkshire", label: "Keld" },
    { value: "scotland", label: "Knockan Crag" },
  ];

  const plainThemes = [
    { value: "default-light", label: "Default blue", preview: "#0061a6" },
    { value: "generic-cyan", label: "HiOSMobile v1.3", preview: "#00687a" },
    { value: "generic-green", label: "Green", preview: "rgb(63 104 54)" },
    { value: "generic-orange", label: "Orange", preview: "rgb(129 85 18)" },
  ];

  const wallpaperModeOptions = [
    { value: "auto", label: "Auto (Match device)" },
    { value: "light", label: "Daytime (Light)" },
    { value: "dark", label: "Nighttime (Dark)" },
  ];

  const genericColourOptions = [
    { value: "default-light", label: "Blue (default)" },
    { value: "generic-cyan", label: "HiOSMobile v1.3 (Cyan)" },
    { value: "generic-green", label: "Green" },
    { value: "generic-orange", label: "Orange" },
  ];

  const handleGlassThemeSelect = (themeValue) => {
    setBackgroundEnabled(true);
    setWallpaperTheme(themeValue);
    setAutoColor(true);
    setAcrylicEnabled(true);
  };

  const handlePlainThemeSelect = (themeValue) => {
    setBackgroundEnabled(false);
    setAcrylicEnabled(false);
    setAutoColor(false);
    setGenericColor(themeValue);
  };

  const getThumbnailUrl = (themeValue) => {
    const basePath = "assets/backgrounds/";
    let isDark = false;

    if (darkModePref === "dark") {
      isDark = true;
    } else if (
      darkModePref === "auto" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      isDark = true;
    }

    const themeName = themeValue === "default" ? "backgroundimage" : themeValue;
    return `url('${basePath}${themeName}${isDark ? "-dark.webp" : ".webp"}')`;
  };

  return (
    <main className="container mt-4 mb-5">
      {/* Tab Navigation */}
      <Card className="mt-1 joinTop metro-anim-list-item delay-1" bodyClass="p-2">
        <div className="sub-nav-pills-header">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              className={`sub-header-tab ripple-button ${activeMainTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveMainTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="tab-content">
        {/* --- THEMES TAB --- */}
        {activeMainTab === "themes" && (
          <div className="fade show active">
            <PageHeader
              title="Themes"
              subtitle="Pick a theme for Harmony from our amazing collection below."
              className="joinMiddle pb-3 metro-anim-list-item delay-2"
            />

            <Row className="g-1">
              <Col size={12}>
                <Card className="joinMiddle metro-anim-list-item delay-3 text-start" title="Landscape collection">
                  <p className="text-start" style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    Beautiful wallpapers paired with our signature glass effect and dynamic colors.
                  </p>

                  <div
                    className="translucentAboutBox d-flex overflow-auto py-3"
                    style={{
                      scrollSnapType: "x mandatory",
                      gap: "12px",
                      msOverflowStyle: "none",
                      scrollbarWidth: "none",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      scrollPaddingLeft: "16px"
                    }}
                  >
                    {glassThemes.map((theme) => {
                      const isActive = backgroundEnabled && wallpaperTheme === theme.value;
                      return (
                        <div
                          key={theme.value}
                          className="flex-shrink-0 text-center"
                          style={{ width: "120px", scrollSnapAlign: "start" }}
                          onClick={() => handleGlassThemeSelect(theme.value)}
                        >
                          <div
                            style={{
                              height: "160px",
                              borderRadius: "var(--radius-card)",
                              backgroundColor: "var(--secondaryContainer)",
                              backgroundImage: getThumbnailUrl(theme.value),
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              border: isActive ? "3px solid var(--primary)" : "1px solid transparent",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                          />
                          <span className="d-block mt-2" style={{ fontSize: "0.85rem" }}>
                            {theme.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card className="joinBottom metro-anim-list-item delay-4" title="Basic colours">
                  <p className="text-start" style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    Clean, distraction-free basic color schemes.
                  </p>

                  <div
                    className="translucentAboutBox d-flex overflow-auto py-3"
                    style={{
                      scrollSnapType: "x mandatory",
                      gap: "12px",
                      msOverflowStyle: "none",
                      scrollbarWidth: "none",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      scrollPaddingLeft: "16px"
                    }}
                  >
                    {plainThemes.map((theme) => {
                      const isActive = !backgroundEnabled && genericColor === theme.value;
                      return (
                        <div
                          key={theme.value}
                          className="flex-shrink-0 text-center"
                          style={{ width: "120px", scrollSnapAlign: "start" }}
                          onClick={() => handlePlainThemeSelect(theme.value)}
                        >
                          <div
                            style={{
                              height: "160px",
                              borderRadius: "var(--radius-card)",
                              backgroundColor: theme.preview,
                              border: isActive ? "3px solid var(--onBackground)" : "1px solid var(--outline)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                          >
                            {isActive && (
                              <span className="material-symbols-rounded fs-1" style={{ color: "var(--background)", textShadow: "0px 2px 5px rgba(0,0,0,0.2)" }}>
                                check_circle
                              </span>
                            )}
                          </div>
                          <span className="d-block mt-2" style={{ fontSize: "0.85rem" }}>
                            {theme.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* --- ADVANCED TAB --- */}
        {activeMainTab === "advanced" && (
          <div className="fade show active">
            <PageHeader
              title="Advanced"
              subtitle="Further customise the look and feel of Harmony to your taste below."
              className="joinMiddle pb-3 metro-anim-list-item delay-2"
            />

            <Row className="g-1">
              <Col size={12} md={6}>
                <Card className="joinMiddle metro-anim-list-item delay-3" title="Wallpaper time-of-day">
                  <div className="settings-group">
                    <Dropdown
                      value={darkModePref}
                      onChange={setDarkModePref}
                      options={wallpaperModeOptions}
                      disabled={!backgroundEnabled}
                      className="joinTop"
                    />
                    <InfoBubble
                      icon="brightness_4"
                      title="Pick a colour of wallpaper."
                      className="joinBottom"
                    >
                      We have a colour of wallpaper for day or night. Have us change the mode automatically with your app theme, or manually set it yourself.
                    </InfoBubble>
                  </div>
                </Card>

                <Card className="joinBottomLeft metro-anim-list-item delay-4" title="Glass and transparency">
                  <div className="settings-group">
                    <Switch
                      label="Glass"
                      checked={acrylicEnabled}
                      onChange={setAcrylicEnabled}
                      disabled={!backgroundEnabled}
                      className="joinTop"
                    />
                    <InfoBubble
                      icon="blur_on"
                      title="Turn glass on or off."
                      className="joinBottom"
                    >
                      Glass is the beautiful effect used throughout Harmony. It stands out amongst the rather dull and plain designs used in today's apps.
                      <MenuActionBtn
                        icon="open_in_new"
                        text="HiMaterial page"
                        className="mt-3"
                        onClick={() => openExternalLink("https://hienterprises.github.io/#/hiosmobile/himaterial")}
                      />
                    </InfoBubble>
                  </div>
                </Card>
              </Col>

              <Col size={12} md={6}>
                <Card
                  className={`${!effectiveAuto ? "rightColJoinTop" : "joinBottomRight"} metro-anim-list-item delay-5`}
                  title="Colours"
                >
                  <div className="settings-group">
                    <Switch
                      label="Enable basic colours"
                      checked={!effectiveAuto}
                      onChange={(checked) => setAutoColor(!checked)}
                      disabled={!backgroundEnabled}
                      className="joinTop"
                    />
                    <InfoBubble
                      icon="colors"
                      title="Turn off dynamic wallpaper colours."
                      className="joinBottom"
                    >
                      Toggle this on if you want to turn off the matching wallpaper colours and use a basic static color scheme instead.
                    </InfoBubble>
                  </div>
                </Card>

                {/* Only renders when Bypass is toggled ON */}
                {!effectiveAuto && (
                  <Card className="joinBottomRight metro-anim-list-item delay-6" title="Basic colours">
                    <div className="settings-group">
                      <Dropdown
                        value={genericColor}
                        onChange={setGenericColor}
                        options={genericColourOptions}
                        className="joinTop"
                      />
                      <InfoBubble
                        icon="colorize"
                        title="Pick a basic colour."
                        className="joinBottom"
                      >
                        Pick the basic colour you want to use when dynamic colours are bypassed.
                      </InfoBubble>
                    </div>
                  </Card>
                )}
              </Col>
            </Row>
          </div>
        )}
      </div>
    </main>
  );
}
