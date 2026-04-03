import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import MenuActionBtn from "../../components/MenuActionBtn";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <main className="container mt-4 mb-5">
      <Card>
        <div className="top-container">
          <h1 className="blue-h2">
            <span className="titleIcon material-symbols-rounded">settings</span>
            Settings
          </h1>
          <p id="para" className="subtitle mb-0">
            Choose a settings category from below.
          </p>
        </div>
      </Card>

      <Card className="mt-2">
        <MenuActionBtn
          icon="palette"
          text="Appearance"
          className="full"
          onClick={() => navigate("/settings/appearance")}
        />
      </Card>
    </main>
  );
}
