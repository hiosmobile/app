import React from "react";
import Card from "../../../components/Card";

export default function Restaurant() {
  return (
    <main className="container mt-4 mb-5">
      <Card>
        <div class="top-container">
          <h1 className="blue-h2">
            <span className="titleIcon material-symbols-rounded">
              restaurant
            </span>
            Hotel
          </h1>
          <p id="para" className="subtitle mb-0">
            Unsure on how to do certain things with this app for visiting The
            Highland Cafe™️? Take a look below.
          </p>
        </div>
      </Card>

      <div className="row g-2">
        <div className="col-12 col-md-6">
          <Card className="mt-2" title="Booking a table">
            <ol className="text-start">
              <li>
                First, tap the
                <span className="helpcenterIcons material-symbols-rounded">
                  restaurant
                </span>
                icon on the bottom or top navigation bar.
              </li>
              <li>
                Tap <b>'Your HiCafe™️ Visit'</b>.
              </li>
              <li>
                Select <b>'Book'</b> at the top right.
              </li>
              <li>Fill in the form to book a table at The Highland Cafe™️.</li>
            </ol>
          </Card>

          <Card className="mt-2" title="Viewing our menus">
            <ol className="text-start">
              <li>
                First, tap the
                <span className="helpcenterIcons material-symbols-rounded">
                  restaurant
                </span>
                icon on the bottom or top navigation bar.
              </li>
              <li>
                Tap <b>'Your HiCafe™️ Visit'</b>.
              </li>
              <li>
                Select <b>'Menus'</b> at the top right.
              </li>
              <li>You can now scroll through our menus as you please.</li>
            </ol>
          </Card>

          <Card className="mt-2" title="Ordering food">
            <ol className="text-start">
              <li>
                First, tap the
                <span className="helpcenterIcons material-symbols-rounded">
                  restaurant
                </span>
                icon on the bottom or top navigation bar.
              </li>
              <li>
                Tap <b>'Your HiCafe™️ Visit'</b>.
              </li>
              <li>
                Select <b>'Order'</b> at the top right.
              </li>
              <li>
                Fill in the form to order food to your table at The Highland
                Cafe™️.
              </li>
            </ol>
          </Card>
        </div>

        <div className="col-12 col-md-6">
          <Card className="mt-2" title="Checking-in to breakfast">
            <ol className="text-start">
              <li>
                First, tap the
                <span className="helpcenterIcons material-symbols-rounded">
                  restaurant
                </span>
                icon on the bottom or top navigation bar.
              </li>
              <li>
                Tap <b>'Breakfast Check-in'</b>.
              </li>
              <li>
                Fill in the form with your details to check-in to breakfast.
              </li>
            </ol>
          </Card>

          <Card className="mt-2" title="Viewing our locations">
            <ol className="text-start">
              <li>
                First, tap the
                <span className="helpcenterIcons material-symbols-rounded">
                  restaurant
                </span>
                icon on the bottom or top navigation bar.
              </li>
              <li>
                Tap <b>'Locations'</b>.
              </li>
              <li>
                Zoom in on each location on the map, and look as you please.
              </li>
            </ol>
          </Card>
        </div>
      </div>
    </main>
  );
}
