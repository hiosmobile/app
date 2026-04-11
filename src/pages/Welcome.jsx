import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import ProgressWidget from "../../components/ProgressWidget";
import RewardsCodeWidget from "../../components/RewardsCodeWidget";
import DateWidget from "../../components/DateWidget";
import WeatherWidget from "../../components/WeatherWidget";
import frameImg from "../assets/media/frame.png";
import MenuActionBtn from "../../components/MenuActionBtn";
import { Menu } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  // Calculate the greeting directly without using state or effects
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good Morning";
    if (hrs <= 17) return "Good Afternoon";
    return "Good Evening";
  };

  const greeting = getGreeting();

  return (
    <main className="container mt-4 mb-5">
      {/* Header Row */}
      <div className="row mb-2">
        <div className="col-12">
          <Card bodyClass="text-start">
            <p className="gradientHeading mb-0">
              <b>{greeting}!</b>
            </p>
            <p className="gradientHeadingSmall">
              Welcome to The Highland Cafe™!
            </p>
          </Card>
        </div>
      </div>

      {/* Main Grid */}
      <div className="row g-2">
        {/* Left Column */}
        <div className="col-12 col-md-6">
          <RewardsCodeWidget
            code="490020-384380-3842992-9"
            imageSrc={frameImg}
          />

          <Card title="Your rewards, at a glance" className="mt-2">
            <div className="row g-2">
              <div className="col-6">
                <ProgressWidget
                  icon="local_cafe"
                  title="HiCafe™ Rewards"
                  current={4}
                  max={10}
                  subtitle="6 away from a free coffee"
                />
              </div>
              <div className="col-6">
                <ProgressWidget
                  icon="hotel"
                  title="weB&B Stays"
                  current={6}
                  max={20}
                  subtitle="14 away from a free night"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="col-12 col-md-6">
          <Card title="Weather">
            <div className="row g-2">
              <div className="col-12">
                <WeatherWidget />
              </div>
            </div>
          </Card>

          <DateWidget />

          <Card className="mt-2">
            <h2 className="card-title">Welcome to the new HiOS!</h2>
            <p>
              This version was built completely from scratch with ReactJS, and a
              brand new custom UI, featuring the all-new HiMaterial 7.1, with
              some beautiful new backgrounds to go with it!
            </p>
            <p className="mt-2">
              This version is still in beta, so we'd apprechiate if you'd pass
              us on some feedback! Ensure to include 'HiOSNext' in the
              submission somewhere.
            </p>
            <MenuActionBtn
              text="Send Feedback"
              icon="feedback"
              className="full"
              onClick={() => navigate("/help/feedback")}
            />
          </Card>
        </div>
      </div>
    </main>
  );
}
