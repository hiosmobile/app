import React, { useContext } from "react";
import {
  Card,
  PageHeader,
  MenuActionBtn,
  Row,
  Col,
  Switch,
  InfoBubble,
} from "../../../components/HiMaterial";
import { ThemeContext } from "../../../components/ThemeContext";
import { Info } from "lucide-react";

export default function Sync() {
  const { syncEnabled, setSyncEnabled } = useContext(ThemeContext);

  return (
    <main className="container mt-4 mb-5">
      <Row className="mb-2">
        <Col size={12}>
          <PageHeader
            icon="cloud_sync"
            title="Backup and sync"
            subtitle="Choose what settings to sync with your HiAccount below."
          />
        </Col>
      </Row>

      <Row className="g-2">
        <Col size={12} md={6}>
          <Card title="Appearance">
            <Switch
              label="Sync HiOS appearance"
              checked={syncEnabled}
              onChange={setSyncEnabled}
              className="joinTop"
            />
            <InfoBubble
              icon="palette"
              title="Sync your themes like a pro."
              className="joinBottom"
            >
              Save your HiOS appearance preferences with your HiAccount so they
              auto-apply on all your devices with HiOS installed. How fancy is
              that?!
            </InfoBubble>
          </Card>
        </Col>

        <Col size={12} md={6}>
          <Card>
            <InfoBubble
              icon="backup"
              title="This is cool, isn't it?!"
              className="joinTop"
            >
              Something we think our loyal users deserve is to be able to sync
              all their preferences with their HiAccount. That's what accounts
              are for, right?
            </InfoBubble>

            <InfoBubble
              icon="dashboard"
              title="More syncs coming soon"
              className="joinBottom"
            >
              We're still in the process of adding more ways to sync HiOS with
              your HiAccount, so watch this space as we progress with our
              updates! We plan to very soon add a toggle for syncing the
              dashboard.
            </InfoBubble>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
