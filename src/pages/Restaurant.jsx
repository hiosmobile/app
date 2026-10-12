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
      <Row>
        <Col size={12}>
          <PageHeader
            title="Eat"
            subtitle="Pick an action below."
            className="mb-1 metro-anim-list-item delay-1"
          />
        </Col>
      </Row>

      <Row className="g-1">
        {/* Left column */}
        <Col size={12} md={6}>
          <Card title="Dining" className="metro-anim-list-item delay-2 mb-1">
            <MenuActionBtn
              icon="dining"
              text="Your HiCafe™ visit"
              className="joinTop"
              onClick={() => navigate("/restaurant/hicafe")}
            />
            <InfoBubble
              className="joinBottom"
              title="Your go-to restaurant."
            >
              Experience the best meal of your life at The Highland Cafe™. What
              are you waiting for? Book a table now!
            </InfoBubble>
          </Card>

          <Card title="Coffee" className="metro-anim-list-item delay-3">
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
          <Card title="Breakfast" className="mb-1 metro-anim-list-item delay-4">
            <MenuActionBtn
              icon="egg_alt"
              text="Breakfast check-in"
              className="joinTop"
              onClick={() =>
                navigate("/viewer", {
                  state: {
                    src: "https://docs.google.com/forms/d/e/1FAIpQLSdjJ0yto-VHoTjDtkYlbvr4XjI2wwd_XN-g7vuRP9aNwF1wwg/viewform?embedded=true",
                    title: "Breakfast check-in",
                  },
                })
              }
            />
            <InfoBubble
              className="joinBottom"
              title="Check-in when you're ready for breakfast."
            >
              If you're staying with us at weB&B, click above once you're hungry
              for breakfast.
            </InfoBubble>
          </Card>

          <Card title="Find us" className="metro-anim-list-item delay-5">
            <MenuActionBtn
              icon="pin_drop"
              text="Locations"
              className="joinTop"
              onClick={() =>
                navigate("/viewer", {
                  state: {
                    src: "https://www.google.com/maps/d/embed?mid=1uifQD-IGknh0jPlri0xvZJ6WTnUOt2k&ehbc=2E312F&noprof=1",
                    title: "Locations",
                  },
                })
              }
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
