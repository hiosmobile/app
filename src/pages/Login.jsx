import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  RippleButton,
  Back,
  PageHeader,
  Row,
  Col,
  InfoBubble,
  TextInput,
  GoogleAuthButton, // Make sure you import the new component
} from "../../components/HiMaterial";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

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
      <Row className="mb-2">
        <Col size={12}>
          <Back backPath="/" />
          <PageHeader
            icon="login"
            title="Log-in"
            subtitle="To get started, please enter your login details below."
            className="joinBottom"
          />
        </Col>
      </Row>

      <Row className="g-2">
        <Col size={12} md={6}>
          <Card title="Log-in with email">
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
                className="joinTop"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <TextInput
                type="password"
                className="joinMiddle"
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
                <span className="material-symbols-rounded">arrow_forward</span>
                <span className="button-text">
                  {isLoading ? "Logging in..." : "Continue"}
                </span>
              </RippleButton>
            </form>

            <button
              type="button"
              className="btn btn-link mx-auto d-block"
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
              className="mt-3 rippleButton"
            />
          </Card>
        </Col>

        <Col size={12} md={6}>
          <Card>
            <InfoBubble
              icon="flare"
              title="Your HiAccount, for all of HiEnterprises™."
              className="joinTop"
            >
              You can do so much with your HiAccount. The sky's (almost) your
              limit!
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
    </main>
  );
}
