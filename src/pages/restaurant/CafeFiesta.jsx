import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Back,
  RippleButton,
  PageHeader,
  Row,
  Col,
  MenuActionBtn,
  InfoBubble,
} from "../../../components/HiMaterial";
import ScrollTop from "../../assets/buttons/scrolltop.bmp";

export default function CafeFiesta() {
  // State to manage which tab is currently active
  const [activeTab, setActiveTab] = useState("menu");
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    const rootDiv = document.getElementById("root");
    if (rootDiv) rootDiv.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="container mt-4 mb-5">
      <Row>
        <Col size={12}>
          <Card className="joinMiddle metro-anim-list-item delay-1" bodyClass="text-start">
            <div className="top-container">
              <h1
                className="blue-h2"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                CafeFiesta
              </h1>
              <p
                className="subtitle mb-0"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Welcome to the artisan coffee shop chain by The Highland Cafe™️.
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="g-1">
        <Col size={12} md={6}>
          <Card title="Menu" className="metro-anim-list-item delay-2">
            <MenuActionBtn
              icon="menu_book"
              text="View menu"
              className="joinTop"
              onClick={() =>
                navigate("/viewer", {
                  state: {
                    src: "https://drive.google.com/file/d/1v6kWr813fKLS25FprgLu0sklpXpjB2Gy/preview",
                    title: "CafeFiesta Menu",
                  },
                })
              }
            />
            <InfoBubble title="View our amazing drinks selection.">
              Our drinks absolutely trump any other coffee shop that claims to be coffee specialists. ✨ NEWSFLASH ✨ the only coffee specialists are US.
            </InfoBubble>
          </Card>
        </Col>

        <Col size={12} md={6}>
          <Card className="metro-anim-list-item delay-3" title="Order">
            <MenuActionBtn
              icon="menu_book"
              text="Order drinks"
              className="joinTop"
              onClick={() =>
                navigate("/viewer", {
                  state: {
                    src: "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAYAABORJhBUQkdCUEhHOTJDMUpIRVVKRzBWNjdNVVQ3QS4u&embed=true",
                    title: "Order from CafeFiesta",
                  },
                })
              }
            />
            <InfoBubble title="Order our amazing drinks now.">
              You like the look of our amazing coffee selection? Order now at the location you're at to experience coffee bliss.
            </InfoBubble>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
