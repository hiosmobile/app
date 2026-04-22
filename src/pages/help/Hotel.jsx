import React from "react";
import { Card } from "../../../components/HiMaterial";

export default function Hotel() {
  return (
    <main className="container mt-4 mb-5">
      <Card>
        <div class="top-container">
          <h1 className="blue-h2">
            <span className="titleIcon material-symbols-rounded">hotel</span>
            Hotel
          </h1>
          <p id="para" className="subtitle mb-0">
            Unsure on how to do something with this app for your stay? Take a
            look below.
          </p>
        </div>
      </Card>

      <div className="row g-2">
        <div className="col-12 col-md-6">
          <Card className="mt-2" title="Booking a room">
            <ol className="text-start">
              <li>
                First, tap the{" "}
                <span className="helpcenterIcons material-symbols-rounded">
                  hotel
                </span>{" "}
                icon on the bottom or top navigation bar.
              </li>
              <li>
                Tap <b>'Book'</b>.
              </li>
              <li>Fill in the form to book a room at weB&B.</li>
            </ol>
          </Card>

          <Card className="mt-2" title="Checking-in">
            <ol className="text-start">
              <li>
                First, tap the{" "}
                <span className="helpcenterIcons material-symbols-rounded">
                  hotel
                </span>{" "}
                icon on the bottom or top navigation bar.
              </li>
              <li>
                Tap <b>'Arriving'</b>.
              </li>
              <li>Fill in the form to check-in to weB&B.</li>
            </ol>
          </Card>
        </div>

        <div className="col-12 col-md-6">
          <Card className="mt-2" title="Checking-out">
            <ol className="text-start">
              <li>
                First, tap the{" "}
                <span className="helpcenterIcons material-symbols-rounded">
                  hotel
                </span>{" "}
                icon on the bottom or top navigation bar.
              </li>
              <li>
                Tap <b>'Leaving'</b>.
              </li>
              <li>Fill in the form to check-out of weB&B.</li>
            </ol>
          </Card>
        </div>
      </div>
    </main>
  );
}
