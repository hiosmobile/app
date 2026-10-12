import React from "react";
import { Card, PageHeader, Row, Col } from "../../../components/HiMaterial";

export default function Hotel() {
  return (
    <main className="container mt-4 mb-5">
      <Row className="mb-1">
        <Col size={12}>
          <PageHeader
            title="Hotel"
            subtitle="Unsure on how to do something with this app for your stay? Take a look below."
            className="metro-anim-list-item delay-1"
          />
        </Col>
      </Row>

      <Row className="g-1">
        <Col size={12} md={6}>
          <Card className="joinMiddle metro-anim-list-item delay-2" title="Booking a room">
            <ol className="text-start">
              <li>
                First, tap the{" "}
                <span className="helpcenterIcons material-symbols-rounded">
                  hotel
                </span>{" "}
                icon on the bottom or top navigation bar.
              </li>
              <li>
                Tap <b>'Book'</b>.
              </li>
              <li>Fill in the form to book a room at weB&B.</li>
            </ol>
          </Card>

          <Card className="joinBottom metro-anim-list-item delay-3" title="Checking-in">
            <ol className="text-start">
              <li>
                First, tap the{" "}
                <span className="helpcenterIcons material-symbols-rounded">
                  hotel
                </span>{" "}
                icon on the bottom or top navigation bar.
              </li>
              <li>
                Tap <b>'Arriving'</b>.
              </li>
              <li>Fill in the form to check-in to weB&B.</li>
            </ol>
          </Card>
        </Col>

        <Col size={12} md={6}>
          <Card className="metro-anim-list-item delay-4 joinBottom" title="Checking-out">
            <ol className="text-start">
              <li>
                First, tap the{" "}
                <span className="helpcenterIcons material-symbols-rounded">
                  hotel
                </span>{" "}
                icon on the bottom or top navigation bar.
              </li>
              <li>
                Tap <b>'Leaving'</b>.
              </li>
              <li>Fill in the form to check-out of weB&B.</li>
            </ol>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
