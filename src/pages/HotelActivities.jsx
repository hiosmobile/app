import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  RippleButton,
  PageHeader,
  Row,
  Col,
  MenuActionBtn,
  InfoBubble,
} from "../../components/HiMaterial";
import ScrollTop from "../assets/buttons/scrolltop.bmp";

export default function HotelActivities() {
  const navigate = useNavigate();

  return (
    <main className="container mt-4 mb-5">
      <Row>
        <Col size={12}>
          <PageHeader
            title="Stay"
            subtitle="Staying at weB&B? Select an option from below to get started."
            className="pb-3 joinTop metro-anim-list-item delay-1"
          />
        </Col>
      </Row>

      <Row className="g-1">
        <Col size={12} md={6}>
          <Card className="metro-anim-list-item delay-2 joinMiddle" title="Book a room">
            <MenuActionBtn
              text="Open booking form"
              icon="calendar_add_on"
              className="joinTop"
              onClick={() =>
                navigate("/viewer", {
                  state: {
                    src: "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAYAABORJhBUNzlCNkROOVc3UzJCTFQ1UVpWQ0pHQk9YSS4u&embed=true",
                    title: "Book a Room",
                  },
                })
              }
            />
            <InfoBubble className="joinBottom" title="Wanting to stay with us?">
              Book a room at weB&B below.
            </InfoBubble>
          </Card>

          <Card className="metro-anim-list-item delay-3 joinMiddle-mobile" title="Check-in">
            <MenuActionBtn
              text="Open check-in form"
              icon="input"
              className="joinTop"
              onClick={() =>
                navigate("/viewer", {
                  state: {
                    src: "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAYAABORJhBUQkJBVkZFSDhCOVJDMjdBRFQ2Sjc3NEM5MS4u&embed=true",
                    title: "Check-out",
                  },
                })
              }
            />
            <InfoBubble className="joinBottom" title="Already booked a room?">
              Welcome! Check in above. :)
            </InfoBubble>
          </Card>
        </Col>

        <Col size={12} md={6}>
          <Card title="Check-out" className="joinBottomRight-mobile metro-anim-list-item delay-4">
            <MenuActionBtn
              text="Open check-out form"
              icon="output"
              className="joinTop"
              onClick={() =>
                navigate("/viewer", {
                  state: {
                    src: "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAYAABORJhBUMjdUUDRPMzg2OE9GOTRaQlNMUjJSUFdONS4u&embed=true",
                    title: "Check-out",
                  },
                })
              }
            />
            <InfoBubble className="joinBottom" title="Leaving us?">
              Thank you for staying with us! Check out below. :)
            </InfoBubble>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
