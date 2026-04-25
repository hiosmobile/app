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

    localStorage.setItem("hiosBackgroundEnabled", backgroundEnabled);
    localStorage.setItem("hiosAcrylicEnabled", acrylicEnabled);
    localStorage.setItem("hiosAutoColor", autoColor);
    localStorage.setItem("hiosWallpaperTheme", wallpaperTheme);
    localStorage.setItem("hiosGenericColor", genericColor);
    localStorage.setItem("hiosColorTheme", activeColorTheme);
    localStorage.setItem("hiosDarkModePreference", darkModePref);
    localStorage.setItem("hiosHighContrastEnabled", highContrastEnabled);
    localStorage.setItem("hiosSyncEnabled", syncEnabled);

    //save to cloud (background sync)
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
    darkModePref,
    activeColorTheme,
    highContrastEnabled,
    isCloudLoaded,
    currentUser,
    syncEnabled,
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
