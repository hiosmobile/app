import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MenuActionBtn, PageHeader, Back } from "../../components/HiMaterial";

export default function FullscreenViewer() {
  const location = useLocation();
  const navigate = useNavigate();

  const { src, title } = location.state || { src: "", title: "Viewer" };

  if (!src) {
    return (
      <main className="container wp-screen wp-anim-in mt-4 mb-5">
        <PageHeader title="error" subtitle="no document found." />
        <MenuActionBtn
          icon="arrow_back"
          text="go back"
          subtitle="return to the previous screen"
          onClick={() => navigate(-1)}
        />
      </main>
    );
  }

  return (
    <div className="wp7-app-page wp-screen wp-anim-in" style={{ zIndex: 9999 }}>
      {/* The top bar containing the new consistent back button.
        It sits naturally inside the standard layout padding.
      */}
      <div
        style={{ padding: "calc(var(--statusbar-pad) + 20px) 20px 10px 20px" }}
      >
        <Back backPath={-1} />
        <h2
          className="wp7-app-title"
          style={{
            margin: 0,
            paddingBottom: "10px",
            color: "var(--onBackground)",
          }}
        >
          {title}
        </h2>
      </div>

      <div
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: "#ffffff",
          boxSizing: "border-box",
        }}
      >
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
    </div>
  );
}
