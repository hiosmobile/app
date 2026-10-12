import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  InfoBubble,
  TextInput,
  RippleButton,
  GoogleAuthButton,
} from "../../components/HiMaterial";
import { useAuth } from "../AuthContext";

export default function Gateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, logout, loginWithGoogle } = useAuth();

  const [activeMainTab, setActiveMainTab] = useState("login");

  // Shared form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || "");

  const mainTabs = [
    { id: "login", label: "Log-in" },
    { id: "signup", label: "Sign-up" },
  ];

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good Morning";
    if (hrs <= 17) return "Good Afternoon";
    return "Good Evening";
  };

  const greeting = getGreeting();

  const handleTabSwitch = (tabId) => {
    setActiveMainTab(tabId);
    setError("");
    setSuccessMessage("");
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signup(email, password, name);
      await logout();

      // Switch to login tab and show success message
      setSuccessMessage("Account created! Please check your email to verify your account before logging in.");
      setActiveMainTab("login");
      setName("");
      setEmail("");
      setPassword("");
      setIsLoading(false);
    } catch (err) {
      setError("Failed to create account. Email may already be in use.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError("Failed to log in with Google.");
      setIsLoading(false);
    }
  };

  return (
    <main className="container mt-4 mb-5">
      <Row className="mb-1">
        <Col size={12}>
          <Card className="metro-anim-list-item delay-1" bodyClass="p-4">
            <Row className="align-items-center">
              <Col className="text-start">
                <p
                  className="blue-h2 mb-0"
                  style={{
                    lineHeight: "1.2",
                  }}
                >
                  {greeting}!
                </p>
                <p className="gradientHeadingSmall mb-0">Welcome to HiOSMobile!</p>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row className="g-1">
        <Col size={12}>
          <Card className="joinTop metro-anim-list-item delay-2" bodyClass="p-2">
            <div className="sub-nav-pills-header">
              {mainTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`sub-header-tab ripple-button metro-anim-list-item ${activeMainTab === tab.id ? "active" : ""}`}
                  onClick={() => handleTabSwitch(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <div className="tab-content">
        {activeMainTab === "login" && (
          <Row className="g-1">
            <Col size={12} md={6}>
              <Card title="Log-in with email" className="metro-anim-list-item delay-3">
                {successMessage && (
                  <InfoBubble
                    icon="check"
                    title={successMessage}
                    className="full"
                  />
                )}

                {error && (
                  <InfoBubble icon="error" title={error} className="full" />
                )}

                <form
                  onSubmit={handleLogin}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <TextInput
                    type="email"
                    className="mb-1"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <TextInput
                    type="password"
                    className="mb-1"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <RippleButton
                    className="button roundedImage joinBottom"
                    type="submit"
                    disabled={isLoading}
                  >
                    <span className="material-symbols-rounded">arrow_forward_ios</span>
                    <span className="button-text">
                      {isLoading ? "Logging in..." : "Continue"}
                    </span>
                  </RippleButton>
                </form>

                <button
                  type="button"
                  className="btn btn-link mx-auto d-block mt-3"
                  style={{
                    textDecoration: "none",
                    fontWeight: "500",
                    color: "var(--error)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot your password?
                </button>

                <div
                  style={{
                    textAlign: "center",
                    margin: "20px 0",
                    opacity: 0.5,
                    fontWeight: "bold",
                  }}
                >
                  — OR —
                </div>

                <GoogleAuthButton
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  text="Continue with Google"
                  className="rippleButton"
                />
              </Card>
            </Col>

            <Col size={12} md={6}>
              <Card className="metro-anim-list-item delay-4">
                <InfoBubble
                  icon="flare"
                  title="Your HiAccount, for all of HiEnterprises™."
                  className="joinTop"
                >
                  You can do so much with your HiAccount. The sky's (almost) your limit!
                </InfoBubble>
                <InfoBubble
                  icon="shield_with_heart"
                  title="Your details are safe with us."
                  className="joinMiddle"
                >
                  Your HiAccount details are kept encrypted, so not even we can see
                  it. Now that's how privacy and security should be.
                </InfoBubble>
                <InfoBubble
                  icon="lock_person"
                  title="We don't sell your data."
                  className="joinBottom"
                >
                  It's scummy, it's bad for you, it's bad for us, and it's bad
                  practice. So rest assured, your data is in safe hands.
                </InfoBubble>
              </Card>
            </Col>
          </Row>
        )}

        {activeMainTab === "signup" && (
          <Row className="g-1">
            <Col size={12} md={6}>
              <Card title="Sign-up with email" className="metro-anim-list-item delay-3">
                {error && (
                  <div
                    className="infoBubble text-start mb-2"
                    style={{
                      backgroundColor: "var(--errorContainer)",
                      color: "var(--onErrorContainer)",
                      padding: "16px",
                      borderRadius: "16px",
                    }}
                  >
                    {error}
                  </div>
                )}

                <form
                  onSubmit={handleSignup}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <TextInput
                    type="text"
                    className="mb-1"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <TextInput
                    type="email"
                    className="mb-1"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <TextInput
                    type="password"
                    className="mb-1"
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                  />

                  <RippleButton
                    className="button roundedImage joinBottom"
                    type="submit"
                    disabled={isLoading}
                  >
                    <span className="material-symbols-rounded">add_task</span>
                    <span className="button-text">
                      {isLoading ? "Creating..." : "Create HiAccount"}
                    </span>
                  </RippleButton>
                </form>

                <div
                  style={{
                    textAlign: "center",
                    margin: "20px 0",
                    opacity: 0.5,
                    fontWeight: "bold",
                  }}
                >
                  — OR —
                </div>

                <p className="text-center mb-2">Create a HiAccount using your Google account.</p>
                <GoogleAuthButton
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  text="Continue with Google"
                  className="rippleButton metro-anim-list-item"
                />
              </Card>
            </Col>

            <Col size={12} md={6}>
              <Card title="What can HiOSMobile do?" className="metro-anim-list-item delay-4">
                <InfoBubble
                  icon="dashboard"
                  title="Your dashboard."
                  className="joinTop"
                >
                  HiOS has a beautiful dashboard for you to see all your HiCafe™
                  info at a glance.
                </InfoBubble>

                <InfoBubble
                  icon="restaurant"
                  title="Your HiCafe™, your way."
                  className="joinMiddle"
                >
                  Browse menus, order ahead, and book tables at The Highland Cafe™
                  and CafeFiesta™.
                </InfoBubble>

                <InfoBubble
                  icon="hotel"
                  title="Your weB&B stays"
                  className="joinMiddle"
                >
                  Manage your hotel reservations, check in digitally, and access
                  your mobile room key.
                </InfoBubble>

                <InfoBubble
                  icon="award_star"
                  title="Rewards with HiRewards™"
                  className="joinBottom"
                >
                  Earn points on every purchase and unlock exclusive discounts
                  across all our locations. When you create a HiAccount, you get access to <i>the</i> best rewards platform on the planet.
                </InfoBubble>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </main>
  );
}
