import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  RippleButton,
  Back,
  PageHeader,
  Row,
  Col,
  TextInput,
  InfoBubble,
} from "../../components/HiMaterial";
import { useAuth } from "../AuthContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      await resetPassword(email);
      setMessage(
        "Check your inbox! We have sent you a link to reset your password.",
      );
    } catch (err) {
      setError("Failed to send link. Please ensure this email is registered.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mt-4 mb-5">
      <Row className="mb-2">
        <Col size={12}>
          <Back backPath="/login" />
          <PageHeader
            icon="lock_reset"
            title="Reset your password"
            subtitle="Enter your email address and we'll send you a recovery link if the
            account exists."
            className="joinBottom"
          />
        </Col>
      </Row>

      <Row className="g-2">
        <Col size={12} md={6}>
          <Card>
            {message && (
              <div
                className="infoBubble text-start"
                style={{
                  backgroundColor: "var(--primaryContainer)",
                  color: "var(--onPrimaryContainer)",
                }}
              >
                {message}
              </div>
            )}

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
              onSubmit={handleReset}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <TextInput
                type="email"
                className="joinTop"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <RippleButton
                className="button roundedImage joinBottom"
                type="submit"
                disabled={isLoading}
              >
                <span className="material-symbols-rounded">send</span>
                <span className="button-text">
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </span>
              </RippleButton>
            </form>
          </Card>
        </Col>

        <Col size={12} md={6}>
          <Card>
            <InfoBubble
              icon="digital_wellbeing"
              title="We've got your back."
              className="full"
            >
              We'll help you get your account back, and you'll be up and running
              again in no time.
            </InfoBubble>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
