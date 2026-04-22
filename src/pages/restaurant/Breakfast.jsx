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
      <Row className="mb-2">
        <Col size={12}>
          <Back backPath="/restaurant" />
          <PageHeader
            icon="egg_alt"
            title="Breakfast check-in"
            subtitle="Use the form below to check-in to breakfast."
            className="joinBottom"
          />
        </Col>
      </Row>

      <Row>
        <Col size={12}>
          <Card>
            <RippleButton
              className="form-button joinTop"
              onClick={() =>
                navigate("/viewer", {
                  state: {
                    src: "https://docs.google.com/forms/d/e/1FAIpQLSdjJ0yto-VHoTjDtkYlbvr4XjI2wwd_XN-g7vuRP9aNwF1wwg/viewform?embedded=true",
                    title: "Check-In to Breakfast",
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
                src="https://docs.google.com/forms/d/e/1FAIpQLSdjJ0yto-VHoTjDtkYlbvr4XjI2wwd_XN-g7vuRP9aNwF1wwg/viewform?embedded=true"
                width="100%"
                height="600"
                frameBorder="0"
              >
                Loading...
              </iframe>
            </div>
            <img
              src={ScrollTop}
              alt="Scroll Top"
              className="mt-4 ripple-button roundedImage"
              style={{ cursor: "pointer" }}
              onClick={ScrollToTop}
            />
          </Card>
        </Col>
      </Row>
    </main>
  );
}
