import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  PageHeader,
  MenuActionBtn,
  InfoBubble,
} from "../../components/HiMaterial";

export default function Restaurant() {
  const navigate = useNavigate();

  return (
    <main className="container mt-4 mb-5">
      <Row className="mb-2">
        <Col size={12}>
          <PageHeader
            icon="restaurant"
            title="Eat"
            subtitle="Pick an action below."
          />
        </Col>
      </Row>

      <Row className="g-2">
        {/* Left column */}
        <Col size={12} md={6}>
          <Card title="Dining">
            <MenuActionBtn
              icon="dining"
              text="Your HiCafe™ visit"
              className="joinTop"
              onClick={() => navigate("/restaurant/hicafe")}
            />
            <InfoBubble
              className="joinBottom"
              title="Your new go-to restaurant."
            >
              Experience the best meal of your life at The Highland Cafe™. What
              are you waiting for? Book a table now!
            </InfoBubble>
          </Card>

          <Card className="mt-2" title="Coffee">
            <MenuActionBtn
              icon="local_cafe"
              text="CafeFiesta™"
              className="joinTop"
              onClick={() => navigate("/restaurant/cafefiesta")}
            />
            <InfoBubble
              className="joinBottom"
              title="The best coffee in the world."
            >
              You've never properly tried coffee unless you've been to
              CafeFiesta™. Go on, see for yourself! Order now!
            </InfoBubble>
          </Card>
        </Col>

        {/* Right column */}
        <Col size={12} md={6}>
          <Card title="Breakfast">
            <MenuActionBtn
              icon="egg_alt"
              text="Breakfast check-in"
              className="joinTop"
              onClick={() => navigate("/restaurant/breakfast")}
            />
            <InfoBubble
              className="joinBottom"
              title="Check-in when you're ready for breakfast."
            >
              If you're staying with us at weB&B, click above once you're hungry
              for breakfast.
            </InfoBubble>
          </Card>

          <Card className="mt-2" title="Find us">
            <MenuActionBtn
              icon="pin_drop"
              text="Locations"
              className="joinTop"
              onClick={() => navigate("/restaurant/locations")}
            />
            <InfoBubble
              className="joinBottom"
              title="Find out where you can visit us."
            >
              Take a look on the page above to see where you can visit our
              restaurants or hotels.
            </InfoBubble>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
