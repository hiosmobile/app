import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  PageNavHeader,
  RippleButton,
  PageHeader,
  Row,
  Col,
  MenuActionBtn,
  InfoBubble
} from "../../../components/HiMaterial";
import ScrollTop from "../../assets/buttons/scrolltop.bmp";
import BookTable from "../../../components/forms/restaurant/BookTable";

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
      <Card className="mt-1 joinTop metro-anim-list-item delay-1" bodyClass="p-2">
        <div className="sub-nav-pills-header">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              className={`sub-header-tab ripple-button ${activeMainTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveMainTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="tab-content">
        {/* --- BOOK TAB CONTENT --- */}
        {activeMainTab === "book" && (
          <div className="fade show active">
            <PageHeader
              title="Book"
              subtitle="Fill in the below form to book a table, and we'll reply within an hour by email."
              className="joinMiddle pb-3 metro-anim-list-item delay-2"
            />
            <Row className="g-1">
              <Col size={12} md={6}>
                <Card className="joinBottomLeft metro-anim-list-item delay-3">
                  <BookTable />
                </Card>
              </Col>

              <Col size={12} md={6}>
                <Card className="joinBottomRight-mobile metro-anim-list-item delay-4">
                  <InfoBubble className="full" title="Note about booking a table">
                    The restaurant you book at will try and get back to you within an hour, but if they don't, assume they're either really busy or there's no tables free, or you've been banned from the location.
                  </InfoBubble>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* --- MENUS TAB CONTENT --- */}
        {activeMainTab === "menus" && (
          <div className="fade show active">
            <PageHeader
              title="Menus"
              subtitle="Take a look at our menus below."
              className="joinMiddle pb-3 metro-anim-list-item delay-2"
            />

            <Row className="g-1">
              <Col size={12} md={6}>
                <Card title="Classics" className="joinMiddle metro-anim-list-item delay-3">
                  <MenuActionBtn
                    icon="dinner_dining"
                    text="Open regular menu"
                    className="joinTop"
                    onClick={() =>
                      navigate("/viewer", {
                        state: {
                          src: "https://drive.google.com/file/d/1Smu3eEMsNc_ToWfnSDiEZEsF-upo1OWV/preview?usp=embed_googleplus",
                          title: "Regular"
                        },
                      })
                    }
                  />
                  <InfoBubble
                    className="joinBottom"
                    title="All the classics you love."
                  >
                    View all your The Highland Cafe™ favourites here, from the classic Breakfast menu, to the newer Gormet menu!
                  </InfoBubble>
                </Card>

                <Card title="Worldwide" className="joinBottomLeft metro-anim-list-item delay-4">
                  <MenuActionBtn
                    icon="connecting_airports"
                    text="Open worldwide menu"
                    className="joinTop"
                    onClick={() =>
                      navigate("/viewer", {
                        state: {
                          src: "https://drive.google.com/file/d/1pXK9euCFK9bvbgIwBJv_wSNRMFPikAg9/view?usp=drive_link",
                          title: "Worldwide"
                        },
                      })
                    }
                  />
                  <InfoBubble
                    className="joinBottom"
                    title="Taste our exotic food."
                  >
                    Our worldwide food is amazing. There is nothing else on the planet that can compete with this much range of countries that we have represented so well in our Worldwide menu. Go on, have a try!
                  </InfoBubble>
                </Card>
              </Col>

              <Col size={12} md={6}>
                <Card className="rightColJoinTop metro-anim-list-item delay-5" title="Pizza">
                  <MenuActionBtn
                    icon="local_pizza"
                    text="Open pizza menu"
                    className="joinTop"
                    onClick={() =>
                      navigate("/viewer", {
                        state: {
                          src: "https://drive.google.com/file/d/1tZH3a5TPs74N8nfz0rhfdMfuEOdsY4LL/preview?usp=embed_googleplus",
                          title: "Pizza"
                        },
                      })
                    }
                  />
                  <InfoBubble
                    className="joinBottom"
                    title="Buy our pizza."
                  >
                    Our pizza is some of the best you can get ever. Nothing beats it. It ranges from classics like hawain all the way to exotics like margarita and pepperoni. Taste the quality.
                  </InfoBubble>
                </Card>

                <Card className="joinBottomRight metro-anim-list-item delay-6" title="Gastro">
                  <MenuActionBtn
                    icon="local_dining"
                    text="Open gastro menu"
                    className="joinTop"
                    onClick={() =>
                      navigate("/viewer", {
                        state: {
                          src: "https://drive.google.com/file/d/1JMqzGzobo50nPBlqFNs1cx6Ce3JPE9fc/preview?usp=embed_googleplus",
                          title: "Gastro"
                        },
                      })
                    }
                  />
                  <InfoBubble
                    className="joinBottom"
                    title="We know food."
                  >
                    That's why we've taken it upon ourselves over the past few years to create some of the best ever Gastro pub favourites for our customers that we know you are bound to love and enjoy :D
                  </InfoBubble>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* --- ORDER TAB CONTENT --- */}
        {activeMainTab === "order" && (
          <div className="fade show active">
            <PageHeader
              title="Order"
              subtitle="Order the food you would like below."
              className="joinMiddle pb-3 metro-anim-list-item delay-2"
            />

            <Row className="g-1">
              <Col size={12} md={6}>
                <Card className="joinBottomLeft metro-anim-list-item delay-3">
                  <MenuActionBtn
                    icon="book"
                    text="Open ordering form"
                    className="joinTop"
                    onClick={() =>
                      navigate("/viewer", {
                        state: {
                          src: "https://docs.google.com/forms/d/e/1FAIpQLSfGzW5su4bVmpeRVGRbDDeudfZkvhbyuXi-pySKLW4qA8WnaA/viewform?embedded=true",
                          title: "Order your food",
                        },
                      })
                    }
                  />
                  <InfoBubble className="joinBottom" title="Order your food from your table.">
                    The standard but lazy option in our restaurants.
                  </InfoBubble>
                </Card>
              </Col>

              <Col size={12} md={6}>
                <Card className="joinBottomRight-mobile metro-anim-list-item delay-4">
                  <InfoBubble className="full" title="Note about ordering your food online">
                    You will need to pay for your meal upon leaving the restaurant. If we don't have a menu item in stock, we'll replace it with what our chef thinks is the best substitution. Otherwise, our waiting staff will let you know.
                  </InfoBubble>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </main>
  );
}
