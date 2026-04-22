import React from "react";
import {
  Card,
  Back,
  Row,
  Col,
  PageHeader,
} from "../../../components/HiMaterial";
import ScrollTop from "../../assets/buttons/scrolltop.bmp";

export default function Locations() {
  const scrollToTop = () => {
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
            icon="pin_drop"
            title="Locations"
            subtitle="Wanting to find all our branches? Look below at the map."
            className="joinBottom"
          />
        </Col>
      </Row>

      <Row>
        <Col size={12}>
          <Card>
            <div className="iframe-wrapper roundedImage">
              <iframe
                className="menu-iframe roundedImage"
                src="https://www.google.com/maps/d/embed?mid=1uifQD-IGknh0jPlri0xvZJ6WTnUOt2k&ehbc=2E312F&noprof=1"
                title="Our Locations Map"
                frameBorder="0"
              ></iframe>
            </div>
            <div className="text-center">
              <img
                src={ScrollTop}
                alt="Scroll Top"
                className="mt-4 roundedImage"
                style={{ cursor: "pointer" }}
                onClick={scrollToTop}
                role="button"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
