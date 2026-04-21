import React from "react";
import ReactDOM from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import { StatusBar } from "@capacitor/status-bar";
import App from "./App.jsx";
import "../components/navigation.css";
import "../components/layout.css";
import "./assets/style.css"; // style.css loads last, ensuring its theme/glass variables overrule everything else
import "@fontsource-variable/google-sans-flex/wght.css";

// Fix for Android safe areas where env(safe-area-inset-*) might return 0px
if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android") {
  // Ensure the status bar floats over the webview and is explicitly transparent
  StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
  StatusBar.setBackgroundColor({ color: "#00000000" }).catch(() => {});

  // Dynamically set top padding based on the actual status bar height
  StatusBar.getInfo()
    .then((info) => {
      if (info && info.height > 0) {
        // Capacitor often returns physical pixels on Android; convert to CSS pixels
        const density = window.devicePixelRatio || 1;
        // On some devices it might already be in CSS pixels. To be safe, if height is > 60 it's definitely physical.
        const heightCss =
          info.height > 60 ? info.height / density : info.height;
        document.documentElement.style.setProperty(
          "--statusbar-pad",
          `${heightCss}px`,
        );
      }
    })
    .catch(console.error);

  // Provide a safe fallback for the bottom navbar on Android
  document.documentElement.style.setProperty(
    "--nav-pad-bottom",
    "max(env(safe-area-inset-bottom), 24px)",
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
