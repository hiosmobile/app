import React from "react";
import Card from "../../../components/Card";

export default function Roomkey() {
  return (
    <main className="container mt-4 mb-5">
      <Card>
        <div class="top-container">
          <h1 className="blue-h2">
            <span className="titleIcon material-symbols-rounded">key</span>
            Room Key
          </h1>
          <p id="para" className="subtitle mb-0">
            Unsure on how to do something with this app for your stay? Take a
            look below.
          </p>
        </div>
      </Card>
      <Card className="mt-2">
        <ol className="text-start">
          <li>
            First, tap the{" "}
            <span className="helpcenterIcons material-symbols-rounded">
              key
            </span>{" "}
            icon on the bottom or top navigation bar.
          </li>
          <li>Now you can unlock your room.</li>
        </ol>
      </Card>
    </main>
  );
}
