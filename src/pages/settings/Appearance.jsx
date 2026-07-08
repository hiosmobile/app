import React, { useContext, useState, useEffect } from "react";
import {
  PageHeader,
  InfoBubble,
  Card,
  Switch,
  Dropdown,
  MenuActionBtn,
  Row,
  Col,
  Modal,
  RippleButton,
} from "../../../components/HiMaterial";
import { ThemeContext } from "../../../components/ThemeContext";
import { openExternalLink } from "../../utils/externalLink";

const wallpaperOptions = [
  { value: "default", label: "Montenegrin Lake (Default)" },
  { value: "dobrota", label: "Dobrota, Montenegro" },
  { value: "spain", label: "Montefrío, Spain" },
  { value: "france", label: "Terrasson, France" },
  { value: "turkey", label: "Tlos, Turkey" },
  { value: "morocco", label: "Dades Gorge, Morocco" },
  { value: "clouds", label: "Cloudy Sunrise, Liverpool" },
  { value: "london", label: "Tower Bridge, London" },
  { value: "yorkshire", label: "Keld, North Yorkshire" },
  { value: "scotland", label: "Knockan Crag, Scotland" },
];

const wallpaperModeOptions = [
  { value: "auto", label: "Auto (Match device)" },
  { value: "light", label: "Daytime (Light)" },
  { value: "dark", label: "Nighttime (Dark)" },
];

const genericColourOptions = [
  { value: "default-light", label: "HiOSMobile 2.x (Default)" },
  { value: "generic-cyan", label: "HiOSMobile v1.3.2 (Cyan)" },
  { value: "generic-green", label: "Green" },
  { value: "generic-orange", label: "Orange" },
];

export default function Appearance() {
  const baseUrl = import.meta.env.BASE_URL;

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
    syncEnabled,
    setSyncEnabled,
  } = useContext(ThemeContext);

  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [originalWallpaper, setOriginalWallpaper] = useState(wallpaperTheme);

  const handleOpenModal = () => {
    setOriginalWallpaper(wallpaperTheme);
    setIsWallpaperModalOpen(true);
  };

  const handleCancel = () => {
    setWallpaperTheme(originalWallpaper);
    setIsWallpaperModalOpen(false);
  };

  const handleSave = () => {
    setIsWallpaperModalOpen(false);
  };

  const currentOption =
    wallpaperOptions.find((opt) => opt.value === wallpaperTheme) ||
    wallpaperOptions[0];

  const effectiveAuto = backgroundEnabled ? autoColor : false;

  const handleBackgroundToggle = (isChecked) => {
    setBackgroundEnabled(isChecked);
    if (!isChecked) {
      setAutoColor(false);
      setAcrylicEnabled(false);
    }
  };

  const currentImageSrc =
    wallpaperTheme === "default"
      ? `${baseUrl}assets/backgrounds/backgroundimage.webp`
      : `${baseUrl}assets/backgrounds/${wallpaperTheme}.webp`;

  useEffect(() => {
    if (!backgroundEnabled) {
      setIsWallpaperModalOpen(false);
    }
  }, [backgroundEnabled]);

  return (
    <main className="container mt-4 mb-5">
      <Row className="mb-2">
        <Col size={12}>
          <PageHeader
            icon="palette"
            title="Appearance"
            subtitle="Customise the look and feel of HiOS to your taste below."
          />
        </Col>
      </Row>

      <Row className="g-2">
        <Col size={12} md={6}>
          <Card title="Wallpaper settings">
            <div className="settings-group mt-3">
              <Row className="g-0 joinTop">
                <Col size={6}>
                  <div
                    onClick={() => handleBackgroundToggle(true)}
                    className={`card joinTopLeft ${backgroundEnabled ? "selected" : ""}`}
                    style={{
                      cursor: "pointer",
                      border: backgroundEnabled
                        ? "3px solid var(--primary) !important"
                        : "0.5px solid var(--outline) !important",
                      margin: 0,
                      height: "100%",
                      position: "relative",
                      transition: "all .2s ease",
                    }}
                  >
                    {backgroundEnabled && (
                      <span
                        className="material-symbols-rounded"
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          zIndex: 2,
                          fontSize: 30,
                          color: "var(--primary)",
                          background: "white",
                          borderRadius: "50%",
                        }}
                      >
                        check_circle
                      </span>
                    )}

                    <img
                      src={`${baseUrl}assets/thumbnails/wallpaper_on.png`}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        filter: backgroundEnabled ? "none" : "brightness(0.6)",
                      }}
                    />
                    <p style={{ margin: "10px 0 0 0" }}>On</p>
                  </div>
                </Col>

                <Col size={6}>
                  <div
                    onClick={() => handleBackgroundToggle(false)}
                    className={`card joinTopRight ${!backgroundEnabled ? "selected" : ""}`}
                    style={{
                      cursor: "pointer",
                      border: !backgroundEnabled
                        ? "3px solid var(--primary) !important"
                        : "0.5px solid var(--outline) !important",
                      margin: 0,
                      height: "100%",
                      position: "relative",
                      transition: "all .2s ease",
                    }}
                  >
                    {!backgroundEnabled && (
                      <span
                        className="material-symbols-rounded"
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          zIndex: 2,
                          fontSize: 30,
                          color: "var(--primary)",
                          background: "white",
                          borderRadius: "50%",
                        }}
                      >
                        check_circle
                      </span>
                    )}

                    <img
                      src={`${baseUrl}assets/thumbnails/wallpaper_off.png`}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        filter: !backgroundEnabled ? "none" : "brightness(0.6)",
                      }}
                    />
                    <p style={{ margin: "10px 0 0 0" }}>Off</p>
                  </div>
                </Col>
              </Row>

              <InfoBubble
                icon="wallpaper"
                title="Turn on or off the background image"
                className="joinBottom"
              >
                For the sake of accessibility, or just your personal preference.
              </InfoBubble>
            </div>

            <h3 className="card-title mb-3 mt-4">Pick a wallpaper</h3>
            <div className="settings-group">
              <RippleButton
                className="joinTop p-0"
                onClick={handleOpenModal}
                style={{
                  width: "100%",
                  borderRadius: "var(--radius-card)",
                  textAlign: "left",
                  display: "block",
                  border: "0.5px solid var(--outline)",
                  overflow: "hidden",
                  opacity: backgroundEnabled ? 1 : 0.5,
                  cursor: backgroundEnabled ? "pointer" : "not-allowed",
                  pointerEvents: backgroundEnabled ? "auto" : "none",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: "140px",
                    width: "100%",
                  }}
                >
                  <img
                    src={currentImageSrc}
                    alt={currentOption.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                      padding: "16px",
                      color: "#ffffff",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                      {currentOption.label}
                    </span>
                    <span className="material-symbols-rounded">wallpaper</span>
                  </div>
                </div>
              </RippleButton>

              <InfoBubble
                icon="photo_prints"
                title="Pick a background. Our backgrounds are stunning."
                className="joinBottom"
              >
                All our background photos were taken by us. We took the light
                mode photos, and Google Gemini generated dark mode versions of
                them, for HiOSMobile.
              </InfoBubble>
            </div>

            <h3 className="card-title mb-3 mt-4">Wallpaper Time of Day</h3>
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
                We have a colour of wallpaper for day or night. And you get the
                choice. Have us change the mode automatically with your app
                theme, or manually set it yourself. Fully up to you.
              </InfoBubble>
            </div>
          </Card>
        </Col>

        <Col size={12} md={6}>
          <Card title="Dynamic colour">
            <div className="settings-group">
              <Switch
                label="Dynamic colour"
                checked={effectiveAuto}
                onChange={setAutoColor}
                disabled={!backgroundEnabled}
                className="joinTop"
              />
              <InfoBubble
                icon="colors"
                title="Turn on or off the dynamic wallpaper colours."
                className="joinBottom"
              >
                This allows you to use a basic default colour scheme, and
                disable the colours which match the wallpapers.
              </InfoBubble>
            </div>

            <h3 className="card-title mb-3 mt-4">Basic colours</h3>
            <div className="settings-group">
              <Dropdown
                value={genericColor}
                onChange={setGenericColor}
                options={genericColourOptions}
                disabled={effectiveAuto}
                className="joinTop"
              />
              <InfoBubble
                icon="colorize"
                title="Pick a basic colour."
                className="joinBottom"
              >
                To pick a basic colour, please disable dynamic wallpaper colours
                to enjoy our very boring basic-ahh colours.
              </InfoBubble>
            </div>

            <h3 className="card-title mb-3 mt-4">Materials</h3>
            <div className="settings-group">
              <Switch
                label="ZenGlass"
                checked={acrylicEnabled}
                onChange={setAcrylicEnabled}
                disabled={!backgroundEnabled}
                className="joinTop"
              />
              <InfoBubble
                icon="blur_on"
                title="Turn on or off ZenGlass."
                className="joinBottom"
              >
                ZenGlass is the beautiful glass effect used throughout HiOS.
                It's our spiritual tribute to beautiful UI designs the '00s, and
                stands out amoungst the rather dull and plain designs used in
                today's apps. Find out more on our HiMaterial page.
                <MenuActionBtn
                  icon="open_in_new"
                  text="HiMaterial page"
                  className="full mt-3"
                  onClick={() =>
                    openExternalLink(
                      "https://hienterprises.github.io/hiosmobile/himaterial",
                    )
                  }
                />
              </InfoBubble>
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        isOpen={isWallpaperModalOpen}
        title="Backgrounds"
        style={{ height: "100vh" }}
        isScrollable={true}
        onClose={handleCancel}
        footer={
          <>
            <button
              type="button"
              className="joinLeft navButtonInactive flex-grow-1"
              onClick={handleCancel}
              style={{ width: "50%" }}
            >
              Cancel
            </button>

            <RippleButton
              type="button"
              className="joinRight form-button m-0 flex-grow-1"
              onClick={handleSave}
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--onPrimary)",
                width: "50%",
              }}
            >
              Save changes
            </RippleButton>
          </>
        }
      >
        <Row className="g-4 m-0 mt-0">
          {wallpaperOptions.map((option) => {
            const isSelected = wallpaperTheme === option.value;

            return (
              <Col size={12} md={6} key={option.value}>
                <div
                  onClick={() => setWallpaperTheme(option.value)}
                  style={{
                    cursor: "pointer",
                    borderRadius: "var(--radius-card)",
                    outline: isSelected
                      ? "4px solid var(--primary)"
                      : "4px solid transparent",
                    outlineOffset: "2px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Card>
                    <img
                      src={
                        option.value === "default"
                          ? `${baseUrl}assets/backgrounds/backgroundimage.webp`
                          : `${baseUrl}assets/backgrounds/${option.value}.webp`
                      }
                      className="card-img-top mb-3"
                      alt={option.label}
                      style={{
                        borderRadius: "25px",
                        objectFit: "cover",
                        maxHeight: "200px",
                        width: "100%",
                      }}
                    />
                    <h4
                      style={{
                        margin: "0 0 5px 0",
                        fontSize: "1.2rem",
                        fontWeight: isSelected ? "bold" : "normal",
                      }}
                    >
                      {option.label}
                    </h4>
                  </Card>
                </div>
              </Col>
            );
          })}
        </Row>
      </Modal>
    </main>
  );
}