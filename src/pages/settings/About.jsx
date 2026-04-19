import React from "react";
import Card from "../../../components/Card";
import logoNew from "../../assets/pics/logos/logo_hiosunified3.png";

export default function About() {
  return (
    <main className="container mt-4 mb-5">
      <Card>
        <div className="top-container">
          <h1 className="blue-h2">
            <span className="titleIcon material-symbols-rounded">info</span>
            About App
          </h1>
        </div>
      </Card>
      <Card className="mt-2">
        <div className="card-body">
          <img
            src={logoNew}
            width="300"
            className="img-fluid roundedImage"
            alt="New Logo"
          />
          <div className="text-start card mt-4 translucentAboutBox">
            <h5 className="card-title">App Name</h5>
            <p className="card-text">HiOSMobile by The Highland Cafe™</p>
            <h5 className="card-title mt-2">HiOSCore Version</h5>
            <p className="card-text">13</p>
            <h5 className="card-title mt-2">HiMaterial Version</h5>
            <p className="card-text">7.1</p>
            <h5 className="card-title mt-2">Latest App Version</h5>
            <p className="card-text">
              Go to Settings - Updates to see version number.
            </p>
          </div>
          <p className="card-text mt-4 small">
            This webapp was made entirely with HTML5, CSS, and Javascript
          </p>
          <p className="card-text small">
            The Android app was made with Java, and the Windows app was made
            with C#, WinUI3 and Xaml.
          </p>
        </div>
      </Card>
    </main>
  );
}
