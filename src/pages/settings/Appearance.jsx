import React, { useContext, useState, useEffect } from "react";
import {
  PageHeader,
  InfoBubble,
  Card,
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
  { value: "auto", label: "Auto", icon: "brightness_auto" },
  { value: "light", label: "Daytime", icon: "light_mode" },
  { value: "dark", label: "Nighttime", icon: "dark_mode" },
];

const genericColourOptions = [
  { value: "default-light", label: "Default", color: "#607d8b" },
  { value: "generic-cyan", label: "Cyan", color: "#00bcd4" },
  { value: "generic-green", label: "Green", color: "#4caf50" },
  { value: "generic-orange", label: "Orange", color: "#ff9800" },
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

  const getWallpaperSrc = (value) =>
    value === "default"
      ? `${baseUrl}assets/backgrounds/backgroundimage.webp`
      : `${baseUrl}assets/backgrounds/${value}.webp`;

  const currentImageSrc = getWallpaperSrc(wallpaperTheme);

  const ChoiceCard = ({ selected, icon, label, colour, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`hm-choice-card ${selected ? "is-selected" : ""}`}
    >
      {selected && (
        <span className="material-symbols-rounded hm-choice-check">
          check_circle
        </span>
      )}

      {colour ? (
        <span
          className="hm-colour-dot"
          style={{ backgroundColor: colour }}
        />
      ) : (
        <span className="material-symbols-rounded hm-choice-card-icon">
          {icon}
        </span>
      )}

      <p className="hm-choice-label">{label}</p>
    </button>
  );

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
              <div className="hm-choice-group cols-2 joinTop">
                <ChoiceCard
                  selected={backgroundEnabled}
                  icon="wallpaper"
                  label="On"
                  onClick={() => handleBackgroundToggle(true)}
                />

                <ChoiceCard
                  selected={!backgroundEnabled}
                  icon="hide_image"
                  label="Off"
                  onClick={() => handleBackgroundToggle(false)}
                />
              </div>

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
                type="button"
                className={`hm-wallpaper-picker joinTop ${
                  !backgroundEnabled ? "is-disabled" : ""
                }`}
                onClick={backgroundEnabled ? handleOpenModal : undefined}
              >
                <img
                  src={currentImageSrc}
                  alt=""
                  aria-hidden="true"
                  className="hm-wallpaper-picker-img"
                />

                <div className="hm-wallpaper-picker-scrim" />

                <div className="hm-wallpaper-picker-content">
                  <span className="material-symbols-rounded hm-wallpaper-picker-icon">
                    photo_library
                  </span>

                  <div className="hm-wallpaper-picker-text">
                    <span className="hm-wallpaper-picker-kicker">
                      Current wallpaper
                    </span>
                    <span className="hm-wallpaper-picker-title">
                      {currentOption.label}
                    </span>
                  </div>
                </div>

                <span className="material-symbols-rounded hm-wallpaper-picker-action">
                  chevron_right
                </span>
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
              <div
                className={`hm-choice-group cols-3 joinTop ${
                  !backgroundEnabled ? "is-disabled" : ""
                }`}
              >
                {wallpaperModeOptions.map((opt) => (
                  <ChoiceCard
                    key={opt.value}
                    selected={backgroundEnabled && darkModePref === opt.value}
                    icon={opt.icon}
                    label={opt.label}
                    onClick={() => setDarkModePref(opt.value)}
                  />
                ))}
              </div>
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
            <div className="settings-group mt-3">
              <div
                className={`hm-choice-group cols-2 joinTop ${
                  !backgroundEnabled ? "is-disabled" : ""
                }`}
              >
                <ChoiceCard
                  selected={backgroundEnabled && effectiveAuto}
                  icon="palette"
                  label="Enabled"
                  onClick={() => setAutoColor(true)}
                />

                <ChoiceCard
                  selected={backgroundEnabled && !effectiveAuto}
                  icon="format_color_reset"
                  label="Disabled"
                  onClick={() => setAutoColor(false)}
                />
              </div>

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
              <div
                className={`hm-choice-group cols-4 joinTop ${
                  effectiveAuto ? "is-disabled" : ""
                }`}
              >
                {genericColourOptions.map((opt) => (
                  <ChoiceCard
                    key={opt.value}
                    selected={!effectiveAuto && genericColor === opt.value}
                    colour={opt.color}
                    label={opt.label}
                    onClick={() => setGenericColor(opt.value)}
                  />
                ))}
              </div>
              <InfoBubble
                icon="colorize"
                title="Pick a basic colour."
                className="joinBottom"
              >
                To pick a basic colour, please disable dynamic wallpaper colours
                to enjoy our very boring basic-ahh colours.
              </InfoBubble>
            </div>

            <h3 className="card-title mb-3 mt-4">ZenGlass</h3>
            <div className="settings-group">
              <div
                className={`hm-choice-group cols-2 joinTop ${
                  !backgroundEnabled ? "is-disabled" : ""
                }`}
              >
                <ChoiceCard
                  selected={backgroundEnabled && acrylicEnabled}
                  icon="blur_on"
                  label="On"
                  onClick={() => setAcrylicEnabled(true)}
                />

                <ChoiceCard
                  selected={backgroundEnabled && !acrylicEnabled}
                  icon="blur_off"
                  label="Off"
                  onClick={() => setAcrylicEnabled(false)}
                />
              </div>

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
        title="Background & style"
        style={{ height: "100vh" }}
        isScrollable={true}
        onClose={handleCancel}
        footer={
          <div className="hm-background-modal-footer">
            <button
              type="button"
              className="hm-background-modal-btn secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <RippleButton
              type="button"
              className="hm-background-modal-btn primary"
              onClick={handleSave}
            >
              Apply background
            </RippleButton>
          </div>
        }
      >
        <div className="hm-background-modal">
          <section className="hm-background-hero">
            <img
              src={currentImageSrc}
              alt=""
              aria-hidden="true"
              className="hm-background-hero-img"
            />

            <div className="hm-background-hero-scrim" />

            <div className="hm-background-preview-shell">
              <div className="hm-background-preview-topbar">
                <span className="material-symbols-rounded">grid_view</span>
                <span>HiOS preview</span>
              </div>

              <div className="hm-background-preview-card main">
                <span className="material-symbols-rounded">palette</span>

                <div>
                  <strong>Appearance</strong>
                  <p>Cards float above this background</p>
                </div>
              </div>

              <div className="hm-background-preview-grid">
                <div className="hm-background-preview-card small">
                  <span className="material-symbols-rounded">wallpaper</span>
                  <strong>Background</strong>
                </div>

                <div className="hm-background-preview-card small">
                  <span className="material-symbols-rounded">blur_on</span>
                  <strong>ZenGlass</strong>
                </div>
              </div>
            </div>

            <div className="hm-background-current">
              <span className="material-symbols-rounded">image</span>

              <div>
                <p>Current app background</p>
                <h3>{currentOption.label}</h3>
              </div>
            </div>
          </section>

          <section className="hm-background-section-header">
            <div>
              <p>HiOS backgrounds</p>
              <h3>Choose a background</h3>
            </div>

            <span className="material-symbols-rounded">photo_library</span>
          </section>

          <section className="hm-background-grid">
            {wallpaperOptions.map((option) => {
              const isSelected = wallpaperTheme === option.value;
              const imageSrc = getWallpaperSrc(option.value);

              return (
                <button
                  type="button"
                  key={option.value}
                  aria-pressed={isSelected}
                  className={`hm-background-tile ${
                    isSelected ? "is-selected" : ""
                  }`}
                  onClick={() => setWallpaperTheme(option.value)}
                >
                  <img
                    src={imageSrc}
                    alt={option.label}
                    className="hm-background-tile-img"
                  />

                  <div className="hm-background-tile-scrim" />

                  {isSelected && (
                    <span className="material-symbols-rounded hm-background-tile-check">
                      check_circle
                    </span>
                  )}

                  <div className="hm-background-tile-label">
                    <span>{option.label}</span>
                  </div>
                </button>
              );
            })}
          </section>
        </div>
      </Modal>
    </main>
  );
}