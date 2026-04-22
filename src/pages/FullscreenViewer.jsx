import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RippleButton, MenuActionBtn, Card } from "../../components/HiMaterial";

export default function FullscreenViewer() {
  const location = useLocation();
  const navigate = useNavigate();

  // Grab the URL passed from the previous page
  const { src, title } = location.state || { src: "", title: "Viewer" };

  // Fallback if accessed directly without a URL
  if (!src) {
    return (
      <main className="container mt-4 mb-5">
        <Card bodyClass="text-center p-4">
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "48px", color: "var(--error)" }}
          >
            error
          </span>
          <h2 className="mt-2">No document found</h2>
          <MenuActionBtn
            icon="arrow_back"
            text="Go back"
            className="joinTop"
            onClick={() => navigate(-1)}
          />
        </Card>
      </main>
    );
  }

  return (
    // Fixed container breaks out of the normal DOM flow to fill the entire screen
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999, // Ensures it sits above any bottom tabs or navigation bars
        backgroundColor: "var(--background)",
      }}
    >
      {/* Floating Back Button */}
      <RippleButton
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "max(env(safe-area-inset-top, 20px), 20px)", // Respects mobile notches
          left: "20px",
          zIndex: 10000,
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Translucent dark background
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          padding: 0,
        }}
      >
        <span className="material-symbols-rounded">arrow_back</span>
      </RippleButton>

      {/* Immersive Iframe */}
      <iframe
        src={src}
        title={title}
        frameBorder="0"
        allow="autoplay"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          border: "none",
        }}
      />
    </div>
  );
}
