import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "../src/AuthContext";
import { db } from "../src/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);

  // Default to Dark Theme and Cyan Accent
  const [appTheme, setAppTheme] = useState(
    localStorage.getItem("hiosAppTheme") || "dark",
  );
  const [accentColor, setAccentColor] = useState(
    localStorage.getItem("hiosAccentColor") || "cyan",
  );
  const [syncEnabled, setSyncEnabled] = useState(
    localStorage.getItem("hiosSyncEnabled") !== "false",
  );

  // Sync from Firebase
  useEffect(() => {
    async function syncFromCloud() {
      if (!currentUser) {
        setIsCloudLoaded(false);
        return;
      }
      try {
        const userDoc = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userDoc);
        if (snap.exists() && snap.data().theme) {
          const c = snap.data().theme;
          if (c.appTheme) setAppTheme(c.appTheme);
          if (c.accentColor) setAccentColor(c.accentColor);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsCloudLoaded(true);
      }
    }
    syncFromCloud();
  }, [currentUser]);

  // Apply to Body
  useEffect(() => {
    // 1. Reset classes
    document.body.className = "";

    // 2. Apply theme (light/dark)
    document.body.classList.add(`theme-${appTheme}`);

    // 3. Apply accent color class (e.g., .accent-mango)
    document.body.classList.add(`accent-${accentColor}`);

    // 4. Persistence
    localStorage.setItem("hiosAppTheme", appTheme);
    localStorage.setItem("hiosAccentColor", accentColor);

    if (isCloudLoaded && currentUser && syncEnabled) {
      setDoc(
        doc(db, "users", currentUser.uid),
        {
          theme: { appTheme, accentColor },
        },
        { merge: true },
      );
    }
  }, [appTheme, accentColor, isCloudLoaded, currentUser, syncEnabled]);

  return (
    <ThemeContext.Provider
      value={{
        appTheme,
        setAppTheme,
        accentColor,
        setAccentColor,
        syncEnabled,
        setSyncEnabled,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
