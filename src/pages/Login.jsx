import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "../../components/Card";
import RippleButton from "../../components/RippleButton";
import Back from "../../components/Back";
import { useAuth } from "../AuthContext";

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
      <Back backPath="/" />
      <Card className="joinBottom" bodyClass="text-start">
        <div className="top-container">
          <h1 className="blue-h2">
            <span className="titleIcon material-symbols-rounded">login</span>
            Log-in
          </h1>
          <p className="subtitle mb-0">
            Welcome back! Please enter your details below to continue your
            journey with HiOS.
          </p>
        </div>
      </Card>

      <Card className="mt-2 joinTop">
        {successMessage && (
          <div
            className="infoBubble text-start"
            style={{
              backgroundColor: "var(--primaryContainer)",
              color: "var(--onPrimaryContainer)",
            }}
          >
            {successMessage}
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
    </main>
  );
}
