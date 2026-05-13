import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  SubNavPills,
  MenuActionBtn,
} from "../../components/HiMaterial";

export default function HotelActivities() {
  const [activeTab, setActiveTab] = useState("book");
  const navigate = useNavigate();

  // The giant WP7 Pivot Headers
  const tabs = [
    { id: "book", label: "book" },
    { id: "checkin", label: "check-in" },
    { id: "checkout", label: "check-out" },
  ];

  // Helper function to cleanly route to your viewer
  const handleOpenViewer = (src, title) => {
    navigate("/viewer", { state: { src, title } });
  };

  return (
    <main className="container wp-screen wp-anim-in mt-4 mb-5">
      {/* Top-level page title without a back button */}
      <PageHeader
        title="hotel"
        subtitle="staying at web&b? select an option below."
      />

      {/* The giant swiping Pivot headers */}
      <SubNavPills
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div style={{ marginTop: "10px" }}>
        {/* --- BOOK TAB CONTENT --- */}
        {activeTab === "book" && (
          <div className="metro-anim-list-item delay-1">
            <MenuActionBtn
              icon="hotel"
              text="book a room"
              subtitle="open the reservation form"
              onClick={() =>
                handleOpenViewer(
                  "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAYAABORJhBUNzlCNkROOVc3UzJCTFQ1UVpWQ0pHQk9YSS4u&embed=true",
                  "Book a Room",
                )
              }
            />
          </div>
        )}

        {/* --- CHECK-IN TAB CONTENT --- */}
        {activeTab === "checkin" && (
          <div className="metro-anim-list-item delay-1">
            <MenuActionBtn
              icon="login"
              text="check-in"
              subtitle="welcome! open the check-in form"
              onClick={() =>
                handleOpenViewer(
                  "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAYAABORJhBUQkJBVkZFSDhCOVJDMjdBRFQ2Sjc3NEM5MS4u&embed=true",
                  "Check-In",
                )
              }
            />
          </div>
        )}

        {/* --- CHECK-OUT TAB CONTENT --- */}
        {activeTab === "checkout" && (
          <div className="metro-anim-list-item delay-1">
            <MenuActionBtn
              icon="logout"
              text="check-out"
              subtitle="thank you for staying! open the check-out form"
              onClick={() =>
                handleOpenViewer(
                  "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAYAABORJhBUMjdUUDRPMzg2OE9GOTRaQlNMUjJSUFdONS4u&embed=true",
                  "Check-Out",
                )
              }
            />
          </div>
        )}
      </div>
    </main>
  );
}
