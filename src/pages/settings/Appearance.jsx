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

  const wallpaperModeOptions = [
    { value: "auto", label: "Auto (Match device)" },
    { value: "light", label: "Daytime (Light)" },
    { value: "dark", label: "Nighttime (Dark)" },
  ];

  const genericColourOptions = [
    { value: "default-light", label: "Harmony 2.x (Default)" },
    { value: "generic-cyan", label: "Harmony v1.3.2 (Cyan)" },
    { value: "generic-green", label: "Green" },
    { value: "generic-orange", label: "Orange" },
  ];

  return (
    <main className="container mt-4 mb-5">
      <Row>
        <Col size={12}>
          <PageHeader
            title="Look and feel"
            subtitle="Customise the look and feel of Harmony to your taste below."
            className="pb-3 joinTop metro-anim-list-item delay-1"
          />
        </Col>
      </Row>

      <Row className="g-1">
        <Col size={12} md={6}>
          <Card title="Wallpaper settings" className="joinMiddle metro-anim-list-item delay-2">
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
          </Card>

          <Card className="joinMiddle metro-anim-list-item delay-3" title="Pick a wallpaper">
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
                them, for Harmony.
              </InfoBubble>
            </div>
          </Card>

          <Card className="joinBottom metro-anim-list-item delay-4" title="Wallpaper time-of-day">
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

        {/*Right column*/}
        <Col size={12} md={6}>
          <Card title="Dynamic colour" className="joinTop metro-anim-list-item delay-5">
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
                disable the colours which match the wallpapers, or use wallpaper-matching colours.
              </InfoBubble>
            </div>
          </Card>

          <Card className="joinMiddle metro-anim-list-item delay-6" title="Basic colours">
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
          </Card>

          <Card className="joinBottom metro-anim-list-item delay-7" title="Glass and transparency">
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
                Glass is the beautiful effect used throughout Harmony.
                It's our spiritual tribute to beautiful UI designs the '00s, and
                stands out amoungst the rather dull and plain designs used in
                today's apps. Find out more on our HiMaterial page.
                <MenuActionBtn
                  icon="open_in_new"
                  text="HiMaterial page"
                  className="mt-3"
                  onClick={() =>
                    openExternalLink(
                      "https://hienterprises.github.io/#/hiosmobile/himaterial",
                    )
                  }
                />
              </InfoBubble>
            </div>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
