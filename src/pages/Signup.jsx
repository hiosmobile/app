import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  RippleButton,
  Back,
  PageHeader,
  Row,
  Col,
} from "../../components/HiMaterial";
import { useAuth } from "../AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signup, logout } = useAuth();
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

  return (
    <main className="container mt-4 mb-5">
      <Back backPath="/" />
      <Card className="joinBottom" bodyClass="text-start">
        <div className="top-container">
          <h1 className="blue-h2">
            <span className="titleIcon material-symbols-rounded">
              person_add
            </span>
            Sign Up
          </h1>
          <p className="subtitle mb-0">
            Create your HiAccount to begin your journey with us.
          </p>
        </div>
      </Card>

      <Card className="mt-2 joinTop">
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
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", border: "none", outline: "none" }}
          />
          <input
            type="email"
            className="form-control mb-2"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", border: "none", outline: "none" }}
          />

          <input
            type="password"
            className="form-control"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            style={{ width: "100%", border: "none", outline: "none" }}
          />

          <RippleButton
            className="button roundedImage full mt-4"
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
    </main>
  );
}
