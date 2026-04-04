import React, { useContext } from "react";
import Card from "../../../components/Card";
import { ThemeContext } from "../../../components/ThemeContext";

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

  const effectiveAuto = backgroundEnabled ? autoColor : false;

  const handleBackgroundToggle = (e) => {
    const isChecked = e.target.checked;
    setBackgroundEnabled(isChecked);
    if (!isChecked) {
      setAutoColor(false);
      setAcrylicEnabled(false);
    }
  };

  return (
    <main className="container mt-4 mb-5">
      <div className="row mb-2">
        <div className="col-12">
          <Card>
            <div className="top-container">
              <h1 className="blue-h2">
                <span className="titleIcon material-symbols-rounded">
                  palette
                </span>
                Appearance
              </h1>
              <p id="para">Customise the look and feel of HiOS below.</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="row g-2">
        {/* Left Column */}
        <div className="col-12 col-md-6">
          <Card>
            <h1 className="card-title">Backgrounds</h1>

            <div className="settings-group mt-3">
              <div className="switchContainer p-3">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <label
                    className="form-check-label ms-2"
                    style={{ marginRight: "auto" }}
                  >
                    Background Image
                  </label>
                  <label className="switch" style={{ marginLeft: "auto" }}>
                    <input
                      type="checkbox"
                      checked={backgroundEnabled}
                      onChange={handleBackgroundToggle}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div className="infoBubble">
                <h4>
                  <span className="material-symbols-rounded helpcenterIcons">
                    wallpaper
                  </span>{" "}
                  Turn on or off the background image.
                </h4>
                <p
                  style={{
                    fontSize: "14px",
                    margin: "8px 0 0 0",
                    opacity: 0.8,
                  }}
                >
                  For the sake of accessibility, or just your personal
                  preference.
                </p>
              </div>
            </div>

            <h3 className="card-subtitle mb-2 mt-4">Pick a Wallpaper</h3>
            <div className="settings-group">
              <select
                className="form-select"
                value={wallpaperTheme}
                onChange={(e) => setWallpaperTheme(e.target.value)}
                disabled={!backgroundEnabled}
              >
                <option value="default">Montenegrin Lake (Default)</option>
                <option value="dobrota">Dobrota, Montenegro</option>
                <option value="spain">Montefrío, Spain</option>
                <option value="france">Terrasson, France</option>
                <option value="turkey">Tlos, Turkey</option>
                <option value="morocco">Dades Gorge, Morocco</option>
                <option value="clouds">Cloudy Sunrise, Liverpool</option>
                <option value="london">Tower Bridge, London</option>
                <option value="yorkshire">Keld, Yorkshire</option>
                <option value="scotland">Knockan Crag, Scotland</option>
              </select>
              <div className="infoBubble">
                <h4>
                  <span className="material-symbols-rounded helpcenterIcons">
                    photo_prints
                  </span>{" "}
                  Pick a background. Our backgrounds are stunning.
                </h4>
                <p
                  style={{
                    fontSize: "14px",
                    margin: "8px 0 0 0",
                    opacity: 0.8,
                  }}
                >
                  All our background photos were taken by us. We took the light
                  mode photos, and Google Gemini generated dark mode versions of
                  them, for HiOSMobile.
                </p>
              </div>
            </div>

            <h3 className="card-subtitle mb-2 mt-4">Theme Mode</h3>
            <div className="settings-group">
              <select
                className="form-select"
                value={darkModePref}
                onChange={(e) => setDarkModePref(e.target.value)}
                disabled={!backgroundEnabled}
              >
                <option value="auto">Auto (Default)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <div className="infoBubble">
                <h4>
                  <span className="material-symbols-rounded helpcenterIcons">
                    palette
                  </span>{" "}
                  Pick a colour of wallpaper.
                </h4>
                <p
                  style={{
                    fontSize: "14px",
                    margin: "8px 0 0 0",
                    opacity: 0.8,
                  }}
                >
                  We have a colour of wallpaper for day or night. And you get
                  the choice. Have us change the mode automatically with your
                  device's dark mode settings, or manually set it yourself.
                  Fully up to you.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12 col-md-6">
          <Card>
            <h1 className="card-title">Colours</h1>

            <h3 className="card-subtitle mb-2 mt-4">Auto Colour Palette</h3>
            <div className="settings-group">
              <div className="switchContainer p-3">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <label
                    className="form-check-label ms-2"
                    style={{ marginRight: "auto" }}
                  >
                    Auto Wallpaper Colours
                  </label>
                  <label className="switch" style={{ marginLeft: "auto" }}>
                    <input
                      type="checkbox"
                      checked={effectiveAuto}
                      onChange={(e) => setAutoColor(e.target.checked)}
                      disabled={!backgroundEnabled}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
              <div className="infoBubble">
                <h4>
                  <span className="material-symbols-rounded helpcenterIcons">
                    colors
                  </span>{" "}
                  Turn on or off the auto wallpaper colours.
                </h4>
                <p
                  style={{
                    fontSize: "14px",
                    margin: "8px 0 0 0",
                    opacity: 0.8,
                  }}
                >
                  This allows you to use a basic default colour scheme, and
                  disable the colours which match the wallpapers.
                </p>
              </div>
            </div>

            <h3 className="card-subtitle mb-2 mt-4">Basic Colours</h3>
            <div className="settings-group">
              <select
                className="form-select"
                value={genericColor}
                onChange={(e) => setGenericColor(e.target.value)}
                disabled={effectiveAuto || !backgroundEnabled}
              >
                <option value="default-light">Blue (Default)</option>
                <option value="generic-green">Green</option>
                <option value="generic-cyan">Cyan</option>
                <option value="generic-orange">Orange</option>
              </select>
              <div className="infoBubble">
                <h4>
                  <span className="material-symbols-rounded helpcenterIcons">
                    colorize
                  </span>{" "}
                  Pick a basic colour.
                </h4>
                <p
                  style={{
                    fontSize: "14px",
                    margin: "8px 0 0 0",
                    opacity: 0.8,
                  }}
                >
                  To pick a basic colour, please disable Auto Wallpaper Colours
                  above.
                </p>
              </div>
            </div>

            <h3 className="card-subtitle mb-2 mt-4">Materials</h3>
            <div className="settings-group">
              <div className="switchContainer p-3">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <label
                    className="form-check-label ms-2"
                    style={{ marginRight: "auto" }}
                  >
                    Acrylic Glass
                  </label>
                  <label className="switch" style={{ marginLeft: "auto" }}>
                    <input
                      type="checkbox"
                      checked={acrylicEnabled}
                      onChange={(e) => setAcrylicEnabled(e.target.checked)}
                      disabled={!backgroundEnabled}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
              <div className="infoBubble">
                <h4>
                  <span className="material-symbols-rounded helpcenterIcons">
                    colorize
                  </span>{" "}
                  Turn on or off the acrylic glass effect.
                </h4>
                <p
                  style={{
                    fontSize: "14px",
                    margin: "8px 0 0 0",
                    opacity: 0.8,
                  }}
                >
                  The acrylic glass effect is the glassy blur effect used
                  throughout HiOSMobile. You can disable this above for
                  accessibility's sake, or just personal preference.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
