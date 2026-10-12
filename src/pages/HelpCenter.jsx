import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  MenuActionBtn,
  Row,
  Col,
  InfoBubble,
  PageHeader
} from "../../components/HiMaterial";

export default function HelpCenter() {
  const navigate = useNavigate();

  return (
    <main className="container mt-4 mb-5">
      <Row>
        <Col size={12}>
          <PageHeader
            title="help"
            subtitle="Choose a help article from below."
            className="pb-3 joinTop metro-anim-list-item delay-1"
          />
        </Col>
      </Row>

      <Row className="g-1">
        {/*Left col*/}
        <Col size={12} md={6}>
          <Card title="How to use HiOSMobile" className="metro-anim-list-item delay-2 joinMiddle">
            <MenuActionBtn
              icon="developer_guide"
              text="Navigation tutorial"
              className="joinTop"
              onClick={() => navigate("/help/tutorial")}
            />
            <InfoBubble
              icon="school"
              title="Learn how to navigate HiOS."
              className="joinBottom"
            >
              Are you a little lost or baffled by how beautiful this app is?
              Take a look here to find out how to actually use this thing to its
              fullest potential.
            </InfoBubble>
          </Card>

          <Card className="joinBottom metro-anim-list-item delay-3" title="General">
            <MenuActionBtn
              icon="restaurant"
              text="Food"
              className="joinTop"
              onClick={() => navigate("/help/food")}
            />

            <MenuActionBtn
              icon="hotel"
              text="Hotel"
              className="joinMiddle"
              onClick={() => navigate("/help/hotel")}
            />

            <MenuActionBtn
              icon="key"
              text="Room Key"
              className="joinMiddle"
              onClick={() => navigate("/help/roomkey")}
            />

            <MenuActionBtn
              icon="wifi"
              text="WiFi and Internet"
              className="joinBottom"
              onClick={() => navigate("/help/internet")}
            />
          </Card>
        </Col>

        {/*Right col*/}
        <Col className="col-12 col-md-6">
          <Card className="metro-anim-list-item delay-4" title="More">
            <MenuActionBtn
              icon="support_agent"
              text="Customer Support"
              className="joinTop"
              onClick={() => navigate("/help/support")}
            />

            <MenuActionBtn
              icon="feedback"
              text="Send Feedback"
              className="joinBottom"
              onClick={() => navigate("/help/feedback")}
            />
          </Card>
        </Col>
      </Row>
    </main>
  );
}
