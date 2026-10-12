import React from "react";
import { Card, PageHeader, Row, Col } from "../../../components/HiMaterial";

export default function Restaurant() {
  return (
    <main className="container mt-4 mb-5">
      <Row className="mb-1">
        <Col size={12}>
          <PageHeader
            title="Food"
            subtitle="Unsure on how to do certain things with this app for visiting The
            Highland Cafe™️? Take a look below."
            />
        </Col>
      </Row>

      <Row className="g-1">
        <Col size={12} md={6}>
          <Card className="metro-anim-list-item delay-1" title="Booking a table">
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
        </Col>

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
      </Row>
    </main>
  );
}
