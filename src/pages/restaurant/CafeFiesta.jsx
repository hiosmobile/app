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
import MyActivity from "../../../components/forms/restaurant/MyActivity";
import ScrollTop from "../../assets/buttons/scrolltop.bmp";
import BaristaOrder from "../../../components/forms/restaurant/CafefiestaOrder";

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
          <Card className="joinTop pb-3 metro-anim-list-item delay-1" bodyClass="text-start">
            <div className="top-container">
              <h1
                className="blue-h2"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Barista
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
          <Card title="Order" className="joinBottomLeft metro-anim-list-item delay-2">
            <BaristaOrder />
          </Card>
        </Col>

        <Col size={12} md={6}>
          <MyActivity targetCollection="restaurant_orders" />
        </Col>
      </Row>
    </main>
  );
}
