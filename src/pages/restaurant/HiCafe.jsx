import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageNavHeader, MenuActionBtn } from "../../../components/HiMaterial";

export default function HiCafe() {
  const [activeMainTab, setActiveMainTab] = useState("book");
  const navigate = useNavigate();

  // The giant WP7 Pivot Headers
  const mainTabs = [
    { id: "book", label: "book" },
    { id: "menus", label: "menus" },
    { id: "order", label: "order" },
  ];

  // Helper function to cleanly route to your viewer
  const handleOpenViewer = (src, title) => {
    navigate("/viewer", { state: { src, title } });
  };

  return (
    <main className="container wp-screen wp-anim-in mt-4 mb-5">
      {/* Renders the giant text headers and the bottom App Bar back button */}
      <PageNavHeader
        backPath="/restaurant"
        tabs={mainTabs}
        activeTab={activeMainTab}
        setActiveTab={setActiveMainTab}
      />

      <div style={{ marginTop: "10px" }}>
        {/* --- BOOK TAB CONTENT --- */}
        {activeMainTab === "book" && (
          <div className="metro-anim-list-item delay-1">
            <p
              style={{
                color: "var(--subtext)",
                fontSize: "1.2rem",
                marginBottom: "30px",
                fontWeight: 300,
              }}
            >
              fill in the form below to book a table, and we'll reply within an
              hour by email.
            </p>
            <MenuActionBtn
              icon="table_restaurant"
              text="book a table"
              subtitle="open the reservation form"
              onClick={() =>
                handleOpenViewer(
                  "https://docs.google.com/forms/d/e/1FAIpQLSfeP-cO7te979Dc-QRmUsBwQTzIojYRtg7Yx3OufiiUcn2r2g/viewform?embedded=true",
                  "Book a Table",
                )
              }
            />
          </div>
        )}

        {/* --- MENUS TAB CONTENT --- */}
        {activeMainTab === "menus" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <p
              style={{
                color: "var(--subtext)",
                fontSize: "1.2rem",
                marginBottom: "20px",
                fontWeight: 300,
              }}
              className="metro-anim-list-item delay-1"
            >
              select a menu to view our offerings.
            </p>

            {/* Staggered Tumble Animations */}
            <MenuActionBtn
              icon="menu_book"
              text="normal menu"
              subtitle="lunch, dinner, and more."
              className="metro-anim-list-item delay-2"
              onClick={() =>
                handleOpenViewer(
                  "https://drive.google.com/file/d/13dZ895jMZmA6D-We0z2Z7fxfnqYPcoa2/preview",
                  "Main Menu",
                )
              }
            />

            <MenuActionBtn
              icon="public"
              text="worldwide menu"
              subtitle="brand new worldwide foods."
              className="metro-anim-list-item delay-3"
              onClick={() =>
                handleOpenViewer(
                  "https://drive.google.com/file/d/1ZTnLTPCGjV0MdHNjTP9JJBSW_WdtSm8i/preview",
                  "Worldwide Menu",
                )
              }
            />

            <MenuActionBtn
              icon="local_pizza"
              text="pizza menu"
              subtitle="majestic new pizza options."
              className="metro-anim-list-item delay-4"
              onClick={() =>
                handleOpenViewer(
                  "https://drive.google.com/file/d/1YezhyJuuUg-sghImzB-zWn-wGnI6l8Ww/preview",
                  "Pizza Menu",
                )
              }
            />

            <MenuActionBtn
              icon="star"
              text="gastro menu"
              subtitle="our most premium dining experience."
              className="metro-anim-list-item delay-5"
              onClick={() =>
                handleOpenViewer(
                  "https://drive.google.com/file/d/1iHoe-pBMn0niY9R2IoZgYmhgXLaz7Mrz/preview",
                  "Gastro Menu",
                )
              }
            />
          </div>
        )}

        {/* --- ORDER TAB CONTENT --- */}
        {activeMainTab === "order" && (
          <div className="metro-anim-list-item delay-1">
            <p
              style={{
                color: "var(--subtext)",
                fontSize: "1.2rem",
                marginBottom: "30px",
                fontWeight: 300,
              }}
            >
              ready to eat? order the food you would like below.
            </p>
            <MenuActionBtn
              icon="edit_document"
              text="start new order"
              subtitle="open the food ordering form"
              onClick={() =>
                handleOpenViewer(
                  "https://docs.google.com/forms/d/e/1FAIpQLSfGzW5su4bVmpeRVGRbDDeudfZkvhbyuXi-pySKLW4qA8WnaA/viewform?embedded=true",
                  "Order",
                )
              }
            />
          </div>
        )}
      </div>
    </main>
  );
}
