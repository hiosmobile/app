import React, { useEffect, useState } from "react";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { PageHeader, Card } from "../../../components/HiMaterial";
import logoNew from "../../assets/pics/logos/logo_hiosunified3.png";
import pkg from "../../../package.json";

export default function About() {
  const [appVersion, setAppVersion] = useState("Loading...");

  useEffect(() => {
    const getVersion = async () => {
      // Check if we are running on a Native Device (Android/iOS)
      if (Capacitor.isNativePlatform()) {
        const info = await App.getInfo();
        setAppVersion(`${info.version} (${info.build})`);
      } else {
        // Fallback for Web/Browser using package.json
        setAppVersion(`${pkg.version} (Web Build)`);
      }
    };
    getVersion();
  }, []);

  return (
    <main className="container mt-4 mb-5">
      <div className="row mb-2">
        <div className="col-12">
          <PageHeader
            icon="info"
            title="About"
            subtitle="Find out the technical details about HiOS below."
          />
        </div>
      </div>

      <div className="row g-2">
        <div className="col-12">
          <Card>
            <img
              src={logoNew}
              width="300"
              className="img-fluid roundedImage"
              alt="New Logo"
            />
            <div className="text-start mt-4 translucentAboutBox">
              <div className="card-body">
                <h2>HiOS by The Highland Cafe™</h2>
                <h5 className="card-title mt-4">Version</h5>
                <p className="card-text">{appVersion}</p>
                <h5 className="card-title mt-3">HiMaterial Version</h5>
                <p className="card-text">7.1</p>
              </div>
            </div>
            <p className="mt-4 small">
              This webapp was made entirely with ReactJS.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
