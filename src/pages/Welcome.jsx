import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import ProgressWidget from "../../components/ProgressWidget";
import RewardsCodeWidget from "../../components/RewardsCodeWidget";
import DateWidget from "../../components/DateWidget";
import WeatherWidget from "../../components/WeatherWidget";
import frameImg from "../assets/media/frame.png";

export default function Home() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting("Good Morning");
    else if (hrs >= 12 && hrs <= 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

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
        </div>
      </div>
    </main>
  );
}
