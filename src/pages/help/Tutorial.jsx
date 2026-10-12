import React from "react";
import { Card, PageHeader } from "../../../components/HiMaterial";
import tutorialGif from "../../assets/media/tutorial.gif";

export default function TutorialHelp() {
  return (
    <main className="container mt-4 mb-5">
      <PageHeader
        title="Navigation tutorial"
        subtitle="Unsure how to navigate and use Harmony? Take a look at the animations below."
        className="metro-anim-list-item delay-1"
      />

      <Card className="mt-1 metro-anim-list-item delay-2" title="Navigating the main pages">
        <img
          className="img-fluid roundedImage mt-2"
          src={tutorialGif}
          alt="Navigation Tutorial Animation"
        />

        <p className="card-text mt-3">
          <i>*More updated animations coming soon*</i>
        </p>
      </Card>
    </main>
  );
}
