import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  RippleButton,
  Back,
  PageHeader,
  Row,
  Col,
  InfoBubble,
  TextInput,
  MenuActionBtn,
  GoogleAuthButton,
} from "../../components/HiMaterial";
import { useAuth } from "../AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signup, logout, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signup(email, password, name);
      await logout();
      navigate("/login", {
        state: {
          message:
            "Account created! Please check your email to verify your account before logging in.",
        },
      });
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
      <Row className="mb-2">
        <Col size={12}>
          <Back backPath="/" />
          <PageHeader
            icon="person_add"
            title="Sign-up"
            subtitle="Create your HiAccount to begin your journey with us."
            className="joinBottom"
          />
        </Col>
      </Row>

      <Row className="g-2">
        <Col size={12} md={6}>
          <Card title="Sign-up with email">
            {error && (
              <div
                className="infoBubble text-start"
                style={{
                  backgroundColor: "var(--errorContainer)",
                  color: "var(--onErrorContainer)",
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
                className="joinTop"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <TextInput
                type="email"
                className="joinMiddle"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <TextInput
                type="password"
                className="joinMiddle"
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
                <span className="material-symbols-rounded">check_circle</span>
                <span className="button-text">
                  {isLoading ? "Creating..." : "Create HiAccount"}
                </span>
              </RippleButton>
            </form>
          </Card>
        </Col>

        <Col size={12} md={6}>
          <Card title="Sign up with Google">
            <p>Create a HiAccount using your Google account below.</p>
            <GoogleAuthButton
              onClick={handleGoogleLogin}
              disabled={isLoading}
              text="Continue with Google"
              className="rippleButton"
            />
          </Card>

          <Card className="mt-2">
            <InfoBubble
              icon="award_star"
              title="Your HiAccount goes far."
              className="full"
            >
              When you create a HiAccount, you get access to HiRewards,{" "}
              <i>the</i> best rewards platform on the planet.
            </InfoBubble>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
