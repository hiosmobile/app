import React from "react";
import {
  PageHeader,
  Card,
  MenuActionBtn,
  InfoBubble,
  Row,
  Col,
} from "../../../components/HiMaterial";
import { openExternalLink } from "../../utils/externalLink";

export default function Apps() {
  return (
    <main className="container mt-4 mb-5">
      <Row className="mb-2">
        <Col size={12}>
          <PageHeader
            icon="dashboard_customize"
            title="Apps and websites"
            subtitle="Take a look at our other great apps, services, and websites below."
          />
        </Col>
      </Row>

      <Row className="g-2">
        {/*Left col*/}
        <Col size={12} md={6}>
          <Card title="Recommended">
            <MenuActionBtn
              icon="music_note"
              text="HiOSMusic"
              className="joinTop"
              onClick={() =>
                openExternalLink("https://github.com/aarjay123/hiosmusic")
              }
            />
            <InfoBubble
              icon="music_note"
              title="This is our brand-new music app."
              className="joinBottom"
            >
              Your Music, Your Vibe.
            </InfoBubble>
          </Card>
        </Col>

        <Col size={12} md={6}>
          <Card title="More">
            <MenuActionBtn
              icon="code"
              text="Other apps by nuggetdev"
              className="joinTop"
              onClick={() =>
                openExternalLink(
                  "https://hienterprises.github.io/nuggetdev/home",
                )
              }
            />
            <InfoBubble
              icon="developer_mode"
              title="Other great software projects."
              className="joinBottom"
            >
              We've got many other software projects that we've been working on.
              Go take a look!
            </InfoBubble>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
