import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, MenuActionBtn } from "../../components/HiMaterial";

export default function Restaurant() {
  const navigate = useNavigate();

  return (
    /* Native WP7 full-page swing-in transition */
    <main className="container wp-screen wp-anim-in mt-4 mb-5">
      {/* Metro Page Header */}
      <PageHeader title="eat" subtitle="select a dining option" />

      {/* Pure Metro List - No Cards, No Borders, Just Data */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <MenuActionBtn
          icon="dining"
          text="hicafe™ visit"
          subtitle="experience the best meal of your life at the highland cafe. book a table now!"
          className="metro-anim-list-item delay-1"
          onClick={() => navigate("/restaurant/hicafe")}
        />

        <MenuActionBtn
          icon="local_cafe"
          text="cafefiesta™"
          subtitle="you've never properly tried coffee unless you've been to cafefiesta. order now!"
          className="metro-anim-list-item delay-2"
          onClick={() => navigate("/restaurant/cafefiesta")}
        />

        <MenuActionBtn
          icon="egg_alt"
          text="breakfast check-in"
          subtitle="staying with us at web&b? tap here once you're hungry for breakfast."
          className="metro-anim-list-item delay-3"
          onClick={() => navigate("/restaurant/breakfast")}
        />

        <MenuActionBtn
          icon="pin_drop"
          text="locations"
          subtitle="find out where you can visit our restaurants or hotels globally."
          className="metro-anim-list-item delay-4"
          onClick={() => navigate("/restaurant/locations")}
        />
      </div>
    </main>
  );
}
