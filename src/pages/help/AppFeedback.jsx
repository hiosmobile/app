import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/Card";
import Back from "../../../components/Back";
import RippleButton from "../../../components/RippleButton";
import ScrollTop from "../../assets/buttons/scrolltop.bmp";

export default function AppFeedback() {
  const [activeTab, setActiveTab] = useState("feedback");
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    const rootDiv = document.getElementById("root");
    if (rootDiv) rootDiv.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="container mt-4 mb-5">
      <Card className="full" bodyClass="text-start">
        <div className="top-container">
          <h1 className="blue-h2">
            <span className="titleIcon material-symbols-rounded">
              rate_review
            </span>
            Send Feedback
          </h1>
          <p id="para" className="subtitle mb-0">
            Use this page to send feedback to us.
          </p>
        </div>
      </Card>

      <Card className="mt-2 joinTop" bodyClass="p-2">
        <div className="sub-nav-pills-header">
          <button
            className={`sub-header-tab ripple-button ${activeTab === "feedback" ? "active" : ""}`}
            onClick={() => setActiveTab("feedback")}
          >
            Feedback
          </button>
          <button
            className={`sub-header-tab ripple-button ${activeTab === "bugreport" ? "active" : ""}`}
            onClick={() => setActiveTab("bugreport")}
          >
            Bug Report
          </button>
          <button
            className={`sub-header-tab ripple-button ${activeTab === "complain" ? "active" : ""}`}
            onClick={() => setActiveTab("complain")}
          >
            Complain
          </button>
        </div>
      </Card>

      <div className="tab-content mt-2">
        {/* --- FEEDBACK TAB CONTENT --- */}
        {activeTab === "feedback" && (
          <div className="fade show active">
            <Card className="joinBottom text-center">
              <h2 className="card-title">App Feedback</h2>
              <p className="card-text">
                Have any feedback on the new HiOS mobile app that you would like
                to share with us? Please fill in the form below :)
              </p>
              <RippleButton
                className="form-button"
                onClick={() =>
                  navigate("/viewer", {
                    state: {
                      src: "https://docs.google.com/forms/d/e/1FAIpQLSdt40E-D8WHqnvFp8B5AFTk2yK7xCEFrunE6lDbuEvYoTrMQQ/viewform?embedded=true",
                      title: "App Feedback",
                    },
                  })
                }
              >
                <span className="form-button-icon material-symbols-rounded">
                  fullscreen
                </span>
                Open Form Fullscreen
              </RippleButton>
              <div className="iframe-wrapper roundedImage mt-2">
                <iframe
                  className="menu-iframe roundedImage"
                  src="https://docs.google.com/forms/d/e/1FAIpQLSdt40E-D8WHqnvFp8B5AFTk2yK7xCEFrunE6lDbuEvYoTrMQQ/viewform?embedded=true"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  title="App Feedback Form"
                >
                  Loading...
                </iframe>
              </div>
              <div className="text-center">
                <img
                  src={ScrollTop}
                  alt="Scroll Top"
                  className="mt-4 roundedImage"
                  style={{ cursor: "pointer" }}
                  onClick={scrollToTop}
                  role="button"
                />
              </div>
            </Card>
          </div>
        )}

        {/* --- BUG REPORT TAB CONTENT --- */}
        {activeTab === "bugreport" && (
          <div className="fade show active">
            <Card className="joinBottom text-center">
              <h2 className="card-title">Bug Report</h2>
              <p className="card-text">
                Have you noticed a bug in HiOSMobile? Then please fill in the
                form below and we'll see to it ASAP!
              </p>
              <RippleButton
                className="form-button"
                onClick={() =>
                  navigate("/viewer", {
                    state: {
                      src: "https://docs.google.com/forms/d/e/1FAIpQLSeP5vjhqfapr854dS6N_sltLmeSXECDjbOz3VO0r5-_GieDhA/viewform?embedded=true",
                      title: "Bug Report",
                    },
                  })
                }
              >
                <span className="form-button-icon material-symbols-rounded">
                  fullscreen
                </span>
                Open Form Fullscreen
              </RippleButton>
              <div className="iframe-wrapper roundedImage mt-2">
                <iframe
                  className="menu-iframe roundedImage"
                  src="https://docs.google.com/forms/d/e/1FAIpQLSeP5vjhqfapr854dS6N_sltLmeSXECDjbOz3VO0r5-_GieDhA/viewform?embedded=true"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  title="Bug Report Form"
                >
                  Loading...
                </iframe>
              </div>
              <div className="text-center">
                <img
                  src={ScrollTop}
                  alt="Scroll Top"
                  className="mt-4 roundedImage"
                  style={{ cursor: "pointer" }}
                  onClick={scrollToTop}
                  role="button"
                />
              </div>
            </Card>
          </div>
        )}

        {/* --- COMPLAIN TAB CONTENT --- */}
        {activeTab === "complain" && (
          <div className="fade show active">
            <Card className="joinBottom text-center">
              <h2 className="card-title">Complain</h2>
              <p className="card-text">
                Wanting to complain for something unsatisfactory you experienced
                from The Highland Cafe(tm)?
                <br />
                We'd rather you didn't, but if you are being persistant about
                it, please fill in the form below. :(
              </p>
              <RippleButton
                className="form-button"
                onClick={() =>
                  navigate("/viewer", {
                    state: {
                      src: "https://docs.google.com/forms/d/e/1FAIpQLSeHXG6XZo0qHtU57Y5IYeqpI44eEUsHVAYRRMVZWL8O1UathQ/viewform?embedded=true",
                      title: "Complain",
                    },
                  })
                }
              >
                <span className="form-button-icon material-symbols-rounded">
                  fullscreen
                </span>
                Open Form Fullscreen
              </RippleButton>
              <div className="iframe-wrapper roundedImage mt-2">
                <iframe
                  className="menu-iframe roundedImage"
                  src="https://docs.google.com/forms/d/e/1FAIpQLSeHXG6XZo0qHtU57Y5IYeqpI44eEUsHVAYRRMVZWL8O1UathQ/viewform?embedded=true"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  title="Complain Form"
                >
                  Loading...
                </iframe>
              </div>
              <div className="text-center">
                <img
                  src={ScrollTop}
                  alt="Scroll Top"
                  className="mt-4 roundedImage"
                  style={{ cursor: "pointer" }}
                  onClick={scrollToTop}
                  role="button"
                />
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
