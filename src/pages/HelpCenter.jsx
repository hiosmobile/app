import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  MenuActionBtn,
  Row,
  Col,
  InfoBubble,
} from "../../components/HiMaterial";

export default function HelpCenter() {
  const navigate = useNavigate();

  return (
    <main className="container mt-4 mb-5">
      <Row className="mb-2">
        <Col size={12}>
          <Card>
            <div className="top-container">
              <h1 className="blue-h2">
                <span className="titleIcon material-symbols-rounded">help</span>
                Help
              </h1>
              <p id="para" className="subtitle mb-0">
                Choose a help article from below.
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="g-2">
        {/*Left col*/}
        <Col size={12} md={6}>
          <Card>
            <h1 className="card-title">How to use HiOS</h1>
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

          <Card className="mt-2">
            <h1 className="card-title">General</h1>
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
          <Card>
            <h1 className="card-title">More</h1>
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
