import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  PageNavHeader,
  RippleButton,
  PageHeader,
} from "../../../components/HiMaterial";
import ScrollTop from "../../assets/buttons/scrolltop.bmp";

export default function HiCafe() {
  const [activeMainTab, setActiveMainTab] = useState("book");
  const [activeMenuTab, setActiveMenuTab] = useState("normal");
  const navigate = useNavigate();

  const mainTabs = [
    { id: "book", icon: "table_restaurant", label: "Book" },
    { id: "menus", icon: "menu_book", label: "Menus" },
    { id: "order", icon: "edit", label: "Order" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    const rootDiv = document.getElementById("root");
    if (rootDiv) rootDiv.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="container mt-4 mb-5">
      <PageNavHeader
        backPath="/restaurant"
        tabs={mainTabs}
        activeTab={activeMainTab}
        setActiveTab={setActiveMainTab}
      />

      <div className="tab-content">
        {/* --- BOOK TAB CONTENT --- */}
        {activeMainTab === "book" && (
          <div className="fade show active">
            <PageHeader
              icon="table_restaurant"
              title="Book a table"
              subtitle="Fill in the below form to book a table, and we'll reply within an hour by email."
              className="joinBottom"
            />
            <Card className="mt-2 full">
              <RippleButton
                className="form-button joinTop"
                onClick={() =>
                  navigate("/viewer", {
                    state: {
                      src: "https://docs.google.com/forms/d/e/1FAIpQLSfeP-cO7te979Dc-QRmUsBwQTzIojYRtg7Yx3OufiiUcn2r2g/viewform?embedded=true",
                      title: "Book a Table",
                    },
                  })
                }
              >
                <span className="form-button-icon material-symbols-rounded">
                  fullscreen
                </span>
                Open Form Fullscreen
              </RippleButton>
              <div className="iframe-wrapper">
                <iframe
                  className="menu-iframe roundedImage joinBottom"
                  src="https://docs.google.com/forms/d/e/1FAIpQLSfeP-cO7te979Dc-QRmUsBwQTzIojYRtg7Yx3OufiiUcn2r2g/viewform?embedded=true"
                  width="100%"
                  height="600"
                  frameBorder="0"
                >
                  Loading…
                </iframe>
              </div>
              <img
                src={ScrollTop}
                alt="Scroll Top"
                className="mt-4 roundedImage"
                style={{ cursor: "pointer" }}
                onClick={scrollToTop}
              />
            </Card>
          </div>
        )}

        {/* --- MENUS TAB CONTENT --- */}
        {activeMainTab === "menus" && (
          <div className="fade show active">
            <PageHeader
              icon="menu_book"
              title="Menus"
              subtitle="Take a look at our menus below."
              className="joinBottom"
            />

            <Card className="mt-2 joinTop" bodyClass="p-2">
              <div className="sub-nav-pills-header">
                <button
                  className={`sub-header-tab ripple-button ${activeMenuTab === "normal" ? "active" : ""}`}
                  onClick={() => setActiveMenuTab("normal")}
                >
                  Normal
                </button>
                <button
                  className={`sub-header-tab ripple-button ${activeMenuTab === "worldwide" ? "active" : ""}`}
                  onClick={() => setActiveMenuTab("worldwide")}
                >
                  Worldwide
                </button>
                <button
                  className={`sub-header-tab ripple-button ${activeMenuTab === "pizza" ? "active" : ""}`}
                  onClick={() => setActiveMenuTab("pizza")}
                >
                  Pizza
                </button>
                <button
                  className={`sub-header-tab ripple-button ${activeMenuTab === "gastro" ? "active" : ""}`}
                  onClick={() => setActiveMenuTab("gastro")}
                >
                  Gastro
                </button>
              </div>
            </Card>

            <div>
              {activeMenuTab === "normal" && (
                <Card
                  className="joinBottom fade show active"
                  title="Normal menu"
                >
                  <p>This menu includes Lunch, Dinner, and more.</p>
                  <RippleButton
                    className="form-button joinTop"
                    onClick={() =>
                      navigate("/viewer", {
                        state: {
                          src: "https://drive.google.com/file/d/13dZ895jMZmA6D-We0z2Z7fxfnqYPcoa2/preview",
                          title: "Main Menu",
                        },
                      })
                    }
                  >
                    <span className="form-button-icon material-symbols-rounded">
                      fullscreen
                    </span>
                    Open Menu Fullscreen
                  </RippleButton>
                  <div className="iframe-wrapper">
                    <iframe
                      className="menu-iframe roundedImage joinBottom"
                      src="https://drive.google.com/file/d/13dZ895jMZmA6D-We0z2Z7fxfnqYPcoa2/preview"
                      width="100%"
                      height="600"
                      frameBorder="0"
                    ></iframe>
                  </div>
                  <img
                    src={ScrollTop}
                    alt="Scroll Top"
                    className="mt-4 ripple-button roundedImage"
                    style={{ cursor: "pointer" }}
                    onClick={scrollToTop}
                  />
                </Card>
              )}

              {activeMenuTab === "worldwide" && (
                <Card
                  className="joinBottom fade show active"
                  title="Worldwide menu"
                >
                  <p>This is our brand new worldwide foods menu.</p>
                  <RippleButton
                    className="form-button joinTop"
                    onClick={() =>
                      navigate("/viewer", {
                        state: {
                          src: "https://drive.google.com/file/d/1ZTnLTPCGjV0MdHNjTP9JJBSW_WdtSm8i/preview",
                          title: "Worldwide Menu",
                        },
                      })
                    }
                  >
                    <span className="form-button-icon material-symbols-rounded">
                      fullscreen
                    </span>
                    Open Menu Fullscreen
                  </RippleButton>
                  <div className="iframe-wrapper">
                    <iframe
                      className="menu-iframe roundedImage joinBottom"
                      src="https://drive.google.com/file/d/1ZTnLTPCGjV0MdHNjTP9JJBSW_WdtSm8i/preview"
                      width="100%"
                      height="1000"
                      frameBorder="0"
                    ></iframe>
                  </div>
                  <img
                    src={ScrollTop}
                    alt="Scroll Top"
                    className="mt-4 ripple-button roundedImage"
                    style={{ cursor: "pointer" }}
                    onClick={scrollToTop}
                  />
                </Card>
              )}

              {activeMenuTab === "pizza" && (
                <Card
                  className="joinBottom fade show active"
                  title="Pizza menu"
                >
                  <p>Take a look at our majestic new pizza menu below now.</p>
                  <RippleButton
                    className="form-button joinTop"
                    onClick={() =>
                      navigate("/viewer", {
                        state: {
                          src: "https://drive.google.com/file/d/1YezhyJuuUg-sghImzB-zWn-wGnI6l8Ww/preview",
                          title: "Pizza Menu",
                        },
                      })
                    }
                  >
                    <span className="form-button-icon material-symbols-rounded">
                      fullscreen
                    </span>
                    Open Menu Fullscreen
                  </RippleButton>
                  <div className="iframe-wrapper">
                    <iframe
                      className="menu-iframe roundedImage joinBottom"
                      src="https://drive.google.com/file/d/1YezhyJuuUg-sghImzB-zWn-wGnI6l8Ww/preview"
                      width="100%"
                      height="1000"
                      frameBorder="0"
                    ></iframe>
                  </div>
                  <img
                    src={ScrollTop}
                    alt="Scroll Top"
                    className="mt-4 ripple-button roundedImage"
                    style={{ cursor: "pointer" }}
                    onClick={scrollToTop}
                  />
                </Card>
              )}

              {activeMenuTab === "gastro" && (
                <Card
                  className="joinBottom fade show active"
                  title="Gastro menu"
                >
                  <p>This is our most premium menu that you will love!</p>
                  <RippleButton
                    className="form-button joinTop"
                    onClick={() =>
                      navigate("/viewer", {
                        state: {
                          src: "https://drive.google.com/file/d/1iHoe-pBMn0niY9R2IoZgYmhgXLaz7Mrz/preview",
                          title: "Gastro Menu",
                        },
                      })
                    }
                  >
                    <span className="form-button-icon material-symbols-rounded">
                      fullscreen
                    </span>
                    Open Menu Fullscreen
                  </RippleButton>
                  <div className="iframe-wrapper">
                    <iframe
                      className="menu-iframe roundedImage joinBottom"
                      src="https://drive.google.com/file/d/1iHoe-pBMn0niY9R2IoZgYmhgXLaz7Mrz/preview"
                      width="100%"
                      height="1000"
                      frameBorder="0"
                    ></iframe>
                  </div>
                  <img
                    src={ScrollTop}
                    alt="Scroll Top"
                    className="mt-4 ripple-button roundedImage"
                    style={{ cursor: "pointer" }}
                    onClick={scrollToTop}
                  />
                </Card>
              )}
            </div>
          </div>
        )}

        {/* --- ORDER TAB CONTENT --- */}
        {activeMainTab === "order" && (
          <div className="fade show active">
            <PageHeader
              icon="edit"
              title="Order"
              subtitle="Order the food you would like below."
              className="joinBottom"
            />

            <Card className="mt-2 full">
              <RippleButton
                className="form-button joinTop"
                onClick={() =>
                  navigate("/viewer", {
                    state: {
                      src: "https://docs.google.com/forms/d/e/1FAIpQLSfGzW5su4bVmpeRVGRbDDeudfZkvhbyuXi-pySKLW4qA8WnaA/viewform?embedded=true",
                      title: "Order",
                    },
                  })
                }
              >
                <span className="form-button-icon material-symbols-rounded">
                  fullscreen
                </span>
                Open Form Fullscreen
              </RippleButton>
              <div className="iframe-wrapper">
                <iframe
                  className="menu-iframe roundedImage joinBottom"
                  src="https://docs.google.com/forms/d/e/1FAIpQLSfGzW5su4bVmpeRVGRbDDeudfZkvhbyuXi-pySKLW4qA8WnaA/viewform?embedded=true"
                  width="100%"
                  height="600"
                  frameBorder="0"
                >
                  Loading…
                </iframe>
              </div>
              <img
                src={ScrollTop}
                alt="Scroll Top"
                className="mt-4 ripple-button roundedImage"
                style={{ cursor: "pointer" }}
                onClick={scrollToTop}
              />
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
