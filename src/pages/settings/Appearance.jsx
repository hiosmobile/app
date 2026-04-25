import React, { useContext } from "react";
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

//code lines went from 320 to ~200 after cleanup

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
    syncEnabled,
    setSyncEnabled,
  } = useContext(ThemeContext);

  const effectiveAuto = backgroundEnabled ? autoColor : false;

  const handleBackgroundToggle = (isChecked) => {
    setBackgroundEnabled(isChecked);
    if (!isChecked) {
      setAutoColor(false);
      setAcrylicEnabled(false);
    }
  };

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

  const darkModeOptions = [
    { value: "auto", label: "Auto (Default)" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];

  const genericColourOptions = [
    { value: "default-light", label: "HiOSMobile 2.x (Default)" },
    { value: "generic-cyan", label: "HiOSMobile v1.3.2 (Cyan)" },
    { value: "generic-green", label: "Green" },
    { value: "generic-orange", label: "Orange" },
  ];

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

      <div className="row g-2">
        {/* Left Column */}
        <div className="col-12 col-md-6">
          <Card title="Cloud sync">
            <div className="settings-group">
              <Switch
                label="Sync with HiAccount"
                checked={syncEnabled}
                onChange={setSyncEnabled}
                className="joinTop"
              />
              <InfoBubble
                icon="cloud_sync"
                title="Backup and sync."
                className="joinBottom"
              >
                Save your HiOS appearance preferences with your HiAccount so
                they auto-apply on all your devices with HiOS installed. How
                fancy is that?!
              </InfoBubble>
            </div>
          </Card>

          <Card title="Wallpaper settings" className="mt-2">
            <div className="settings-group mt-3">
              <Switch
                label="Wallpaper"
                checked={backgroundEnabled}
                onChange={handleBackgroundToggle}
                className="joinTop"
              />
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
              <Dropdown
                value={wallpaperTheme}
                onChange={setWallpaperTheme}
                options={wallpaperOptions}
                disabled={!backgroundEnabled}
                className="joinTop"
              />
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

            <h3 className="card-title mb-3 mt-4">Wallpaper colour</h3>
            <div className="settings-group">
              <Dropdown
                value={darkModePref}
                onChange={setDarkModePref}
                options={darkModeOptions}
                disabled={!backgroundEnabled}
                className="joinTop"
              />
              <InfoBubble
                icon="palette"
                title="Pick a colour of wallpaper."
                className="joinBottom"
              >
                We have a colour of wallpaper for day or night. And you get the
                choice. Have us change the mode automatically with your device's
                dark mode settings, or manually set it yourself. Fully up to
                you.
              </InfoBubble>
            </div>
          </Card>
        </div>

        {/*Right column*/}
        <div className="col-12 col-md-6">
          <Card title="Colour settings">
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
                icon="colorize"
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
        </div>
      </div>
    </main>
  );
}
