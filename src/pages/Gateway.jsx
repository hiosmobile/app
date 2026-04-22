import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  MenuActionBtn,
  Row,
  Col,
  InfoBubble,
} from "../../components/HiMaterial";
import Logo from "../assets/pics/logos/hiosbadge.png";
import { openExternalLink } from "../utils/externalLink";

export default function Gateway() {
  const navigate = useNavigate();

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good Morning";
    if (hrs <= 17) return "Good Afternoon";
    return "Good Evening";
  };

  const greeting = getGreeting();

  return (
    <main className="container mt-4 mb-5">
      <Row className="mb-2">
        <Col size={12}>
          <Card bodyClass="p-4">
            {/* Use g-3 to set a specific, clean gap between logo and text */}
            <Row className="align-items-center g-3">
              <Col size="auto">
                <img
                  src={Logo}
                  alt="HiOS Logo"
                  style={{ width: "80px", display: "block" }}
                />
              </Col>
              <Col className="text-start">
                <p
                  className="gradientHeading mb-0"
                  style={{
                    lineHeight: "1.2", // Tightens the "Good Morning" wrap
                  }}
                >
                  <b>{greeting}!</b>
                </p>
                <p className="gradientHeadingSmall mb-0">Welcome to HiOS!</p>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row className="g-2">
        <Col size={12} md={6}>
          <Card title="Get Started">
            <p>
              Please log in to or create your HiAccount to access your
              membership, view your rewards, and manage your stays.
            </p>
            <MenuActionBtn
              icon="login"
              text="Log-in"
              className="joinTop"
              onClick={() => navigate("/login")}
            />
            <InfoBubble
              icon="waving_hand"
              title="Hello, nice to see you again!"
              className="joinBottom"
            >
              Welcome back! We're glad to have you here!
            </InfoBubble>
          </Card>

          <Card title="No HiAccount? Make a new one!" className="mt-2">
            <MenuActionBtn
              icon="person_add"
              text="Sign-up"
              className="joinTop"
              onClick={() => navigate("/signup")}
            />
            <InfoBubble
              icon="shield_with_heart"
              title="Your details are safe with us."
              className="joinBottom"
            >
              Your HiAccount details are kept encrypted, so not even we can see
              it. Now that's how privacy and security should be.
            </InfoBubble>
          </Card>
        </Col>

        <Col size={12} md={6}>
          <Card title="What can HiOS do?">
            <InfoBubble
              icon="dashboard"
              title="Your dashboard."
              className="joinTop"
            >
              HiOS has a beautiful dashboard for you to see all your HiCafe™
              info at a glance.
            </InfoBubble>

            <InfoBubble
              icon="restaurant"
              title="Your HiCafe™, your way."
              className="joinMiddle"
            >
              Browse menus, order ahead, and book tables at The Highland Cafe™
              and CafeFiesta™.
            </InfoBubble>

            <InfoBubble
              icon="hotel"
              title="Your weB&B stays"
              className="joinMiddle"
            >
              Manage your hotel reservations, check in digitally, and access
              your mobile room key.
            </InfoBubble>

            <InfoBubble
              icon="award_star"
              title="Rewards with HiRewards™"
              className="joinBottom"
            >
              Earn points on every purchase and unlock exclusive discounts
              across all our locations.
            </InfoBubble>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
