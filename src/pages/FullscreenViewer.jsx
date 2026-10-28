import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RippleButton, Card } from "../../components/HiMaterial";

export default function FullscreenViewer() {
  const location = useLocation();
  const navigate = useNavigate();

  // Grab the URL passed from the previous page
  const { src, title } = location.state || { src: "", title: "viewer" };

  // Fallback if accessed directly without a URL
  if (!src) {
    return (
      <main className="container mt-4 mb-5">
        <Card className="joinTop" bodyClass="d-flex align-items-center p-2">
          <RippleButton
            delay={150}
            className="nav-icon-btn metro-tile-btn flex-shrink-0"
            onClick={() => navigate(-1)}
            style={{ width: "40px", height: "40px", padding: 0 }}
          >
            <span className="material-symbols-rounded">arrow_back_ios</span>
          </RippleButton>
        </Card>
        <Card className="joinBottom text-center p-4">
          <span
            className="material-symbols-rounded mb-2"
            style={{ fontSize: "48px", color: "var(--error)" }}
          >
            error
          </span>
          <h2 className="blue-h2" style={{ fontSize: "2rem" }}>no document found</h2>
        </Card>
      </main>
    );
  }

  return (
    // Fixed container sits above tabs but utilizes flexbox to structure the cards
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "var(--background)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Card */}
      <div style={{ padding: "max(env(safe-area-inset-top, 15px), 15px) 15px 0 15px" }}>
        <Card className="joinTop" bodyClass="d-flex align-items-center p-2">
          <RippleButton
            delay={150}
            className="nav-icon-btn metro-tile-btn flex-shrink-0"
            onClick={() => navigate(-1)}
            style={{ width: "40px", height: "40px", padding: 0 }}
          >
            <span className="material-symbols-rounded">arrow_back_ios</span>
          </RippleButton>
          <div className="ms-3 text-start text-truncate" style={{ flex: 1 }}>
            <h1 className="blue-h2 mb-0 text-truncate" style={{ fontSize: "1.8rem" }}>
              {title}
            </h1>
          </div>
        </Card>
      </div>

      {/* Iframe Card */}
      <div 
        style={{ 
          flex: 1, 
          padding: "3px 15px max(env(safe-area-inset-bottom, 15px), 15px) 15px", 
          minHeight: 0 // Crucial to prevent the iframe from stretching past the screen height
        }}
      >
        <Card className="joinBottom h-100" bodyClass="p-0 h-100" style={{ overflow: "hidden" }}>
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
              backgroundColor: "var(--surface)"
            }}
          />
        </Card>
      </div>
    </div>
  );
}
