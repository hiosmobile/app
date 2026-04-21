import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [backgroundEnabled, setBackgroundEnabled] = useState(
    localStorage.getItem("hiosBackgroundEnabled") !== "false",
  );
  const [acrylicEnabled, setAcrylicEnabled] = useState(
    localStorage.getItem("hiosAcrylicEnabled") !== "false",
  );
  const [autoColor, setAutoColor] = useState(
    localStorage.getItem("hiosAutoColor") !== "false",
  );
  const [wallpaperTheme, setWallpaperTheme] = useState(
    localStorage.getItem("hiosWallpaperTheme") || "default",
  );
  const [genericColor, setGenericColor] = useState(
    localStorage.getItem("hiosGenericColor") || "default-light",
  );
  const [darkModePref, setDarkModePref] = useState(
    localStorage.getItem("hiosDarkModePreference") || "auto",
  );
  const [highContrastEnabled, setHighContrastEnabled] = useState(
    localStorage.getItem("hiosHighContrastEnabled") === "true",
  );

  const activeColorTheme = autoColor ? wallpaperTheme : genericColor;

  useEffect(() => {
    document.body.className = activeColorTheme;

    if (highContrastEnabled) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }

    if (!backgroundEnabled) {
      document.body.classList.add("background-off");
    } else {
      document.body.classList.remove("background-off");
    }

    if (backgroundEnabled && acrylicEnabled && !highContrastEnabled) {
      document.body.classList.add("acrylic-on");
    } else {
      document.body.classList.remove("acrylic-on");
    }

    localStorage.setItem("hiosBackgroundEnabled", backgroundEnabled);
    localStorage.setItem("hiosAcrylicEnabled", acrylicEnabled);
    localStorage.setItem("hiosAutoColor", autoColor);
    localStorage.setItem("hiosWallpaperTheme", wallpaperTheme);
    localStorage.setItem("hiosGenericColor", genericColor);
    localStorage.setItem("hiosColorTheme", activeColorTheme);
    localStorage.setItem("hiosDarkModePreference", darkModePref);
    localStorage.setItem("hiosHighContrastEnabled", highContrastEnabled);
  }, [
    backgroundEnabled,
    acrylicEnabled,
    autoColor,
    wallpaperTheme,
    genericColor,
    darkModePref,
    activeColorTheme,
    highContrastEnabled,
  ]);

  const getWallpaperUrl = () => {
    const basePath = "assets/backgrounds/";
    let isDark =
      darkModePref === "dark" ||
      (darkModePref === "auto" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    const themeName =
      wallpaperTheme === "default" ? "backgroundimage" : wallpaperTheme;
    return `url('${basePath}${themeName}${isDark ? "-dark.webp" : ".webp"}')`;
  };

  return (
    <ThemeContext.Provider
      value={{
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
        highContrastEnabled,
        setHighContrastEnabled,
      }}
    >
      {backgroundEnabled && !highContrastEnabled && (
        <div className="background-wrapper">
          <div
            className="background-image"
            style={{ backgroundImage: getWallpaperUrl() }}
          ></div>
        </div>
      )}
      {children}
    </ThemeContext.Provider>
  );
};
