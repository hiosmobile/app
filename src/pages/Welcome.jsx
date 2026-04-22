import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  ProgressWidget,
  MenuActionBtn,
  PageHeader,
  Row,
  Col,
} from "../../components/HiMaterial";

import RewardsCodeWidget from "../../components/RewardsCodeWidget";
import DateWidget from "../../components/DateWidget";
import WeatherWidget from "../../components/WeatherWidget";
import frameImg from "../assets/media/frame.png";
import { useAuth } from "../AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const name = currentUser?.displayName?.split(" ")[0] || "HiOS User";

  const membershipCode = currentUser?.uid
    ? currentUser.uid.slice(0, 10).toUpperCase()
    : "490020-384380-3842992-9";

  // Calculate the greeting directly without using state or effects
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good Morning";
    if (hrs <= 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getMessage = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Have a good day ahead.";
    if (hrs <= 17) return "Hope you have a nice afternoon.";
    return "Have a nice night.";
  };

  const greeting = getGreeting();

  const message = getMessage();

  return (
    <main className="container mt-4 mb-5">
      {/* Header Row */}
      <Row className="mb-2">
        <Col size={12}>
          <Card bodyClass="text-start">
            <p className="gradientHeading mb-0">
              <b>
                {greeting}, {name}!
              </b>
            </p>
            <p className="gradientHeadingSmall">{message}</p>
          </Card>
        </Col>
      </Row>

      {/* Main Grid */}
      <Row className="g-2">
        {/* Left Column */}
        <Col size={12} md={6}>
          <RewardsCodeWidget code={membershipCode} imageSrc={frameImg} />

          <Card title="Your rewards, at a glance" className="mt-2">
            <Row className="g-1">
              <Col size={6}>
                <ProgressWidget
                  icon="local_cafe"
                  title="HiCafe™ Rewards"
                  current={4}
                  max={10}
                  subtitle="6 away from a free coffee"
                  className="joinLeft"
                />
              </Col>
              <Col size={6}>
                <ProgressWidget
                  icon="hotel"
                  title="weB&B Stays"
                  current={6}
                  max={20}
                  subtitle="14 away from a free night"
                  className="joinRight"
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Right Column */}
        <Col size={12} md={6}>
          <Card title="Weather">
            <Row className="g-2">
              <Col size={12}>
                <WeatherWidget />
              </Col>
            </Row>
          </Card>

          <Card title="Calendar" className="mt-2">
            <Row className="g-2">
              <Col size={12}>
                <DateWidget />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
