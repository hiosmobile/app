import React from "react";
import PageHeader from "../../../components/PageHeader";
import Card from "../../../components/Card";
import MenuActionBtn from "../../../components/MenuActionBtn";
import InfoBubble from "../../../components/InfoBubble";
import { openExternalLink } from "../../utils/externalLink";

export default function Apps() {
  return (
    <main className="container mt-4 mb-5">
      <div className="row mb-2">
        <div className="col-12">
          <PageHeader
            icon="dashboard_customize"
            title="Apps and websites"
            subtitle="Take a look at our other great apps, services, and websites below."
          />
        </div>
      </div>

      <div className="row g-2">
        {/*Left col*/}
        <div className="col-12 col-md-6">
          <Card title="Recommended">
            <MenuActionBtn
              icon="music_note"
              text="HiOSMusic"
              className="full"
              onClick={() =>
                openExternalLink("https://github.com/aarjay123/hiosmusic")
              }
            />
            <InfoBubble
              icon="music_note"
              title="This is our brand-new music app."
            >
              Your Music, Your Vibe.
            </InfoBubble>
          </Card>
        </div>

        <div className="col-12 col-md-6">
          <Card>
            <MenuActionBtn
              icon="code"
              text="Other apps by nuggetdev"
              className="full"
              onClick={() =>
                openExternalLink(
                  "https://hienterprises.github.io/nuggetdev/home",
                )
              }
            />
            <InfoBubble
              icon="developer_mode"
              title="Other great software projects."
            >
              We've got many other software projects that we've been working on.
              Go take a look!
            </InfoBubble>
          </Card>
        </div>
      </div>
    </main>
  );
}
