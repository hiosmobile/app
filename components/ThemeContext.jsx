import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "../src/AuthContext";
import { db } from "../src/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);

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

  // Global App Theme (UI)
  const [appThemeMode, setAppThemeMode] = useState(
    localStorage.getItem("hiosAppThemeMode") || "auto",
  );

  // Wallpaper Time of Day
  const [darkModePref, setDarkModePref] = useState(
    localStorage.getItem("hiosDarkModePreference") || "auto",
  );

  const [highContrastEnabled, setHighContrastEnabled] = useState(
    localStorage.getItem("hiosHighContrastEnabled") === "true",
  );
  const [syncEnabled, setSyncEnabled] = useState(
    localStorage.getItem("hiosSyncEnabled") !== "false",
  );

  const activeColorTheme = autoColor ? wallpaperTheme : genericColor;

  useEffect(() => {
    async function syncFromCloud() {
      if (currentUser) {
        try {
          const userDoc = doc(db, "users", currentUser.uid);
          const snap = await getDoc(userDoc);

          if (snap.exists() && snap.data().theme) {
            const cloudTheme = snap.data().theme;

            if (cloudTheme.backgroundEnabled !== undefined)
              setBackgroundEnabled(cloudTheme.backgroundEnabled);
            if (cloudTheme.acrylicEnabled !== undefined)
              setAcrylicEnabled(cloudTheme.acrylicEnabled);
            if (cloudTheme.autoColor !== undefined)
              setAutoColor(cloudTheme.autoColor);
            if (cloudTheme.wallpaperTheme !== undefined)
              setWallpaperTheme(cloudTheme.wallpaperTheme);
            if (cloudTheme.genericColor !== undefined)
              setGenericColor(cloudTheme.genericColor);
            if (cloudTheme.appThemeMode !== undefined)
              setAppThemeMode(cloudTheme.appThemeMode);
            if (cloudTheme.darkModePref !== undefined)
              setDarkModePref(cloudTheme.darkModePref);
            if (cloudTheme.highContrastEnabled !== undefined)
              setHighContrastEnabled(cloudTheme.highContrastEnabled);
          }
        } catch (error) {
          console.error("Failed to sync theme from cloud:", error);
        }
      }
      setIsCloudLoaded(true);
    }

    syncFromCloud();
  }, [currentUser]);

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

    // Apply Global Light/Dark Mode override classes to the body
    document.body.classList.remove("theme-dark", "theme-light");
    if (appThemeMode === "dark") {
      document.body.classList.add("theme-dark");
    } else if (appThemeMode === "light") {
      document.body.classList.add("theme-light");
    }

    localStorage.setItem("hiosBackgroundEnabled", backgroundEnabled);
    localStorage.setItem("hiosAcrylicEnabled", acrylicEnabled);
    localStorage.setItem("hiosAutoColor", autoColor);
    localStorage.setItem("hiosWallpaperTheme", wallpaperTheme);
    localStorage.setItem("hiosGenericColor", genericColor);
    localStorage.setItem("hiosColorTheme", activeColorTheme);
    localStorage.setItem("hiosAppThemeMode", appThemeMode);
    localStorage.setItem("hiosDarkModePreference", darkModePref);
    localStorage.setItem("hiosHighContrastEnabled", highContrastEnabled);
    localStorage.setItem("hiosSyncEnabled", syncEnabled);

    // Save to cloud
    if (isCloudLoaded && currentUser && syncEnabled) {
      const userDoc = doc(db, "users", currentUser.uid);
      setDoc(
        userDoc,
        {
          theme: {
            backgroundEnabled,
            acrylicEnabled,
            autoColor,
            wallpaperTheme,
            genericColor,
            appThemeMode,
            darkModePref,
            highContrastEnabled,
          },
        },
        { merge: true },
      ).catch((err) => console.error("Failed to save theme to cloud", err));
    }
  }, [
    backgroundEnabled,
    acrylicEnabled,
    autoColor,
    wallpaperTheme,
    genericColor,
    appThemeMode,
    darkModePref,
    activeColorTheme,
    highContrastEnabled,
    isCloudLoaded,
    currentUser,
    syncEnabled,
  ]);

  const getWallpaperUrl = () => {
    const basePath = "assets/backgrounds/";

    let isDark = false;
    const prefersDarkOS =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    // 1. Check Wallpaper Specific Setting
    if (darkModePref === "dark") {
      isDark = true;
    } else if (darkModePref === "light") {
      isDark = false;
    } else {
      // 2. If Wallpaper is 'Auto', check Global App Theme
      if (appThemeMode === "dark") {
        isDark = true;
      } else if (appThemeMode === "light") {
        isDark = false;
      } else {
        // 3. If Both are 'Auto', check OS Settings
        isDark = prefersDarkOS;
      }
    }

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
        appThemeMode,
        setAppThemeMode,
        darkModePref,
        setDarkModePref,
        highContrastEnabled,
        setHighContrastEnabled,
        syncEnabled,
        setSyncEnabled,
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
