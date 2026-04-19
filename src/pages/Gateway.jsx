import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import MenuActionBtn from "../../components/MenuActionBtn";
import Logo from "../assets/pics/logos/hiosbadge.png";

export default function Gateway() {
  const navigate = useNavigate();

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good Morning";
    if (hrs <= 17) return "Good Afternoon";
    return "Good Evening";
  };

  const greeting = getGreeting();

  return (
    <main className="container mt-4 mb-5">
      <div className="row mb-2">
        <div className="col-12">
          <Card bodyClass="text-start p-4">
            <div className="d-flex align-items-center">
              <img
                src={Logo}
                alt="HiOS Logo"
                style={{ width: "60px", marginRight: "15px" }}
              />
              <div>
                <p className="gradientHeading mb-0">
                  <b>{greeting}!</b>
                </p>
                <p className="gradientHeadingSmall mb-0">Welcome to HiOS!</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="row g-2">
        <div className="col-12 col-md-6">
          <Card title="Get Started" bodyClass="text-start">
            <p>
              Please log in to or create your HiAccount to access your
              membership, view your rewards, and manage your stays.
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "3px" }}
            >
              <MenuActionBtn
                icon="login"
                text="Log-in"
                className="joinTop"
                onClick={() => navigate("/login")}
              />

              <MenuActionBtn
                icon="person_add"
                text="Sign-up"
                className="joinBottom"
                onClick={() => navigate("/signup")}
              />
            </div>
          </Card>
        </div>

        <div className="col-12 col-md-6">
          <Card title="What can you do with HiOS?" className="h-100">
            <div className="d-flex align-items-start mb-3 text-start">
              <span
                className="material-symbols-rounded me-2"
                style={{ color: "var(--primary)" }}
              >
                award_star
              </span>
              <div>
                <h4>HiRewards</h4>
                <p>
                  Earn points on every purchase and unlock exclusive discounts
                  across all our locations.
                </p>
              </div>
            </div>

            <div className="d-flex align-items-start mb-3 text-start">
              <span
                className="material-symbols-rounded me-2"
                style={{ color: "var(--primary)" }}
              >
                restaurant
              </span>
              <div>
                <h4>Dining</h4>
                <p>
                  Browse menus, order ahead, and book tables at The Highland
                  Cafe(tm) and CafeFiesta.
                </p>
              </div>
            </div>

            <div className="d-flex align-items-start text-start">
              <span
                className="material-symbols-rounded me-2"
                style={{ color: "var(--primary)" }}
              >
                hotel
              </span>
              <div>
                <h4>weB&B Stays</h4>
                <p>
                  Manage your hotel reservations, check in digitally, and access
                  your mobile room key.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
