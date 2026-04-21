import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  RippleButton,
  Back,
  PageHeader,
  Row,
  Col,
} from "../../components/HiMaterial";
import { useAuth } from "../AuthContext";
import InfoBubble from "../../components/InfoBubble";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
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
          />
        </Col>
      </Row>

      <Row className="g-2">
        <Col size={12} md={6}>
          <Card title="Your login details">
            {successMessage && (
              <InfoBubble icon="check" title={successMessage} />
            )}

            {error && <InfoBubble icon="error" title={error} />}

            <form
              onSubmit={handleLogin}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <input
                type="email"
                className="form-control mb-2"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", outline: "none" }}
              />

              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", outline: "none" }}
              />

              <RippleButton
                className="button roundedImage full mt-4"
                type="submit"
                disabled={isLoading}
              >
                <span className="material-symbols-rounded">arrow_forward</span>
                <span className="button-text">
                  {isLoading ? "Logging in..." : "Continue"}
                </span>
              </RippleButton>
              <button
                type="button"
                className="btn btn-link mt-3 mx-auto"
                style={{
                  textDecoration: "none",
                  fontWeight: "500",
                  color: "var(--error)",
                }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot your password?
              </button>
            </form>
          </Card>
        </Col>

        <Col size={12} md={6}>
          <Card>
            <InfoBubble
              icon="flare"
              title="Your HiAccount, for all of HiEnterprises™."
            >
              You can do so much with your HiAccount. The sky's (almost) your
              limit!
            </InfoBubble>
            <InfoBubble
              icon="shield_with_heart"
              title="Your details are safe with us."
            >
              Your HiAccount details are kept encrypted, so not even we can see
              it. Now that's how privacy and security should be.
            </InfoBubble>
            <InfoBubble icon="lock_person" title="We don't sell your data.">
              It's scummy, it's bad for you, it's bad for us, and it's bad
              practice. So rest assured, your data is in safe hands.
            </InfoBubble>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
