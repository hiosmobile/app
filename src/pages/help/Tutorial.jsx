import React from "react";
import { Card, PageHeader, Row, Col, InfoBubble } from "../../../components/HiMaterial";
import tutorialGif from "../../assets/media/tutorial.gif";

export default function TutorialHelp() {
  return (
    <main className="container mt-4 mb-5">
      <PageHeader
        title="Tutorial"
        subtitle="Unsure how to navigate and use Harmony? Take a look at the animations below."
        className="joinTop pb-3 metro-anim-list-item delay-1"
      />

      <Row className="g-1">
        <Col size={12} md={6}>
          <Card className="joinBottomLeft metro-anim-list-item delay-2" title="Navigating the main pages">
            <img
              className="img-fluid roundedImage mt-2"
              src={tutorialGif}
              alt="Navigation Tutorial Animation"
            />
          </Card>
        </Col>

        <Col size={12} md={6}>
          <Card className="joinBottomRight-mobile" title="Polite notice">
            <InfoBubble icon="info" title="Please note" className="full">
              This tutorial page is awaiting an updated navigation GIF. Basically the whole help center needs to be finished. Watch this space. :)
            </InfoBubble>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
