import React, { createContext, useState, useEffect, useRef } from "react";
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

  // Track OS theme preference dynamically for wallpapers
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  const activeColorTheme = autoColor ? wallpaperTheme : genericColor;

  // Keep track of the previous theme class to safely remove it later
  const prevThemeRef = useRef(activeColorTheme);

  // Listen for OS dark mode changes in real-time
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setSystemPrefersDark(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Sync from Firebase
  useEffect(() => {
    async function syncFromCloud() {
      // 1. If auth is still loading or user is logged out, reset the lock and abort
      if (!currentUser) {
        setIsCloudLoaded(false);
        return;
      }

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
      } finally {
        // 2. Only unlock the ability to save to the cloud AFTER the fetch completes
        setIsCloudLoaded(true);
      }
    }

    syncFromCloud();
  }, [currentUser]);

  // Apply classes and save to local/cloud
  useEffect(() => {
    // Safely update the theme class without destroying other classes on the body
    if (prevThemeRef.current) {
      document.body.classList.remove(prevThemeRef.current);
    }
    if (activeColorTheme) {
      document.body.classList.add(activeColorTheme);
    }
    prevThemeRef.current = activeColorTheme;

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
    let isDark = false;

    // 1. Check Wallpaper Specific Setting
    if (darkModePref === "dark") {
      isDark = true;
    } else if (darkModePref === "light") {
      isDark = false;
    } else {
      // 2. If Auto, fall back to reactive system preference
      isDark = systemPrefersDark;
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
