import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import RippleButton from "../../components/RippleButton";
import Back from "../../components/Back";
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
      <Back backPath="/login" />
      <Card className="joinBottom" bodyClass="text-start">
        <div className="top-container">
          <h1 className="blue-h2">
            <span className="titleIcon material-symbols-rounded">
              lock_reset
            </span>
            Reset Password
          </h1>
          <p className="subtitle mb-0">
            Enter your email and we'll send you a recovery link.
          </p>
        </div>
      </Card>

      <Card className="mt-2 joinTop">
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
          <input
            type="email"
            className="form-control mb-4"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", border: "none", outline: "none" }}
          />

          <RippleButton
            className="button roundedImage full"
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
    </main>
  );
}
