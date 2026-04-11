import React from "react";
import Card from "../../../components/Card";
import tutorialGif from "../../assets/media/tutorial.gif";

export default function TutorialHelp() {
  return (
    <main className="container mt-4 mb-5">
      <Card className="full" bodyClass="text-start">
        <div className="top-container">
          <h1 className="blue-h2">
            <span className="titleIcon material-symbols-rounded">
              developer_guide
            </span>
            Navigation Tutorial
          </h1>
          <p id="para" className="subtitle mb-0">
            Unsure on how to navigate and use HiOS? Take a look at the
            animations below.
          </p>
        </div>
      </Card>

      <Card className="mt-2" title="Navigating the main pages">
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
