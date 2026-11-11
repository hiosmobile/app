import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Back,
  RippleButton,
  PageHeader,
  Row,
  Col,
} from "../../../components/HiMaterial";
import ScrollTop from "../../assets/buttons/scrolltop.bmp";
import BreakfastCheckin from "../../../components/forms/restaurant/BreakfastCheckin";
import MyActivity from "../../../components/forms/restaurant/MyActivity";

export default function Breakfast() {
  const navigate = useNavigate();

  const ScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    const rootDiv = document.getElementById("root");
    if (rootDiv) rootDiv.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="container mt-4 mb-5">
      <Row>
        <Col size={12}>
          <PageHeader
            title="Breakfast check-in"
            subtitle="Use the form below to check-in to breakfast."
            className="joinTop pb-3 metro-anim-list-item delay-1"
          />
        </Col>
      </Row>

      <Row className="g-1">
        <Col size={12} md={6}>
          <Card className="joinBottomLeft metro-anim-list-item delay-2">
            <BreakfastCheckin />
          </Card>
        </Col>

        <Col size={12} md={6}>
          <MyActivity targetCollection="breakfast_checkin" />
        </Col>
      </Row>
    </main>
  );
}
