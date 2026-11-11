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

import BookRoom from "../../components/forms/hotel/BookRoom";

import ScrollTop from "../assets/buttons/scrolltop.bmp";
import MyActivity from "../../components/forms/restaurant/MyActivity";
import HotelCheckin from "../../components/forms/hotel/HotelCheckin";
import HotelCheckout from "../../components/forms/hotel/HotelCheckout";

export default function HotelActivities() {
  const navigate = useNavigate();

  const [activeMainTab, setActiveMainTab] = useState("book");

  const mainTabs = [
    { id: "book", label: "Book" },
    { id: "checkin", label: "Check-in" },
    { id: "checkout", label: "Check-out" },
  ];

  return (
    <>
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
        {activeMainTab === "book" && (
        <div className="fade show active">
          <Row>
            <Col size={12}>
              <PageHeader
                title="Book a room"
                subtitle="Wanting to stay with us? Please book a room below."
                className="pb-3 joinMiddle metro-anim-list-item delay-2"
              />
            </Col>
          </Row>

          <Row className="g-1">
                <Col size={12} md={6}>
                  <Card className="joinBottomLeft metro-anim-list-item delay-3">
                    <BookRoom />
                  </Card>
                </Col>

                <Col size={12} md={6}>
                  <MyActivity targetCollection="hotel_bookings" />
                </Col>
          </Row>
        </div>
        )}

        {activeMainTab === "checkin" && (
          <div className="fade show ">
            <Row>
              <Col size={12}>
                <PageHeader
                  title="Check-in"
                  subtitle="Check-in to your hotel room below."
                  className="pb-3 joinMiddle metro-anim-list-item delay-2"
                />
              </Col>
            </Row>

            <Row className="g-1">
              <Col size={12} md={6}>
                <Card className="joinBottomLeft metro-anim-list-item delay-3">
                  <HotelCheckin />
                </Card>
              </Col>

              <Col size={12} md={6}>
                <MyActivity targetCollection="hotel_checkin" />
              </Col>
            </Row>
          </div>
        )}

          {activeMainTab === "checkout" && (
            <div className="fade show">
              <Row>
                <Col size={12}>
                  <PageHeader
                    title="Check-out"
                    subtitle="Thanks for staying with us! Check-out of your hotel room below."
                    className="pb-3 joinMiddle metro-anim-list-item delay-2"
                  />
                </Col>
              </Row>

              <Row className="g-1">
                <Col size={12} md={6}>
                  <Card className="joinBottomLeft metro-anim-list-item delay-3">
                    <HotelCheckout />
                  </Card>
                </Col>

                <Col size={12} md={6}>
                  <MyActivity targetCollection="hotel_checkout" />
                </Col>
              </Row>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
