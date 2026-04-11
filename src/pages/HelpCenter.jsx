import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import MenuActionBtn from "../../components/MenuActionBtn";

export default function HelpCenter() {
  const navigate = useNavigate();

  return (
    <main className="container mt-4 mb-5">
      <div className="row mb-2">
        <div className="col-12">
          <Card>
            <div className="top-container">
              <h1 className="blue-h2">
                <span className="titleIcon material-symbols-rounded">help</span>
                Help
              </h1>
              <p id="para" className="subtitle mb-0">
                Choose a help article from below.
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="row g-2">
        {/*Left col*/}
        <div className="col-12 col-md-6">
          <Card>
            <h1 className="card-title">How to use HiOS</h1>
            <MenuActionBtn
              icon="developer_guide"
              text="Navigation tutorial"
              className="full"
              onClick={() => navigate("/help/tutorial")}
            />
          </Card>

          <Card className="mt-2">
            <h1 className="card-title">General</h1>
            <MenuActionBtn
              icon="restaurant"
              text="Food"
              className="joinTop"
              onClick={() => navigate("/help/food")}
            />

            <MenuActionBtn
              icon="hotel"
              text="Hotel"
              className="joinMiddle"
              onClick={() => navigate("/help/hotel")}
            />

            <MenuActionBtn
              icon="key"
              text="Room Key"
              className="joinMiddle"
              onClick={() => navigate("/help/roomkey")}
            />

            <MenuActionBtn
              icon="wifi"
              text="WiFi and Internet"
              className="joinBottom"
              onClick={() => navigate("/help/internet")}
            />
          </Card>
        </div>

        {/*Right col*/}
        <div className="col-12 col-md-6">
          <Card>
            <h1 className="card-title">More</h1>
            <MenuActionBtn
              icon="support_agent"
              text="Customer Support"
              className="joinTop"
              onClick={() => navigate("/help/support")}
            />

            <MenuActionBtn
              icon="feedback"
              text="Send Feedback"
              className="joinBottom"
              onClick={() => navigate("/help/feedback")}
            />
          </Card>
        </div>
      </div>
    </main>
  );
}
