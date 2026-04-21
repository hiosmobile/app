import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import PageHeader from "../../../components/PageHeader";
import Card from "../../../components/Card";
import MenuActionBtn from "../../../components/MenuActionBtn";
import { openExternalLink } from "../../utils/externalLink";

export default function Updates() {
  const navigate = useNavigate();
  const [appVersion, setAppVersion] = useState("Loading...");

  //get current app version from bundle
  useEffect(() => {
    const getVersion = async () => {
      const info = await App.getInfo();
      setAppVersion(`${info.version} (${info.build})`);
    };
    getVersion();
  }, []);

  return (
    <main className="container mt-4 mb-5">
      <div className="row mb-2">
        <div className="col-12">
          <PageHeader
            icon="system_update"
            title="Updates"
            subtitle="Take a look at our updates options for HiOS below."
          />
        </div>
      </div>

      <div className="row g-2">
        <div className="col-12 col-md-6">
          <Card title="Update sources"></Card>
        </div>
      </div>
    </main>
  );
}
