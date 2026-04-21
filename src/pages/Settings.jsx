import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";
import MenuActionBtn from "../../components/MenuActionBtn";
import RippleButton from "../../components/RippleButton";
import { useAuth } from "../AuthContext";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
  deleteUser,
} from "firebase/auth";

export default function Settings() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // Modal State Management
  const [activeModal, setActiveModal] = useState(null); // 'name', 'password', 'delete', or null
  const [passwordInput, setPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [modalStatus, setModalStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Greeting Logic
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good Morning";
    if (hrs <= 17) return "Good Afternoon";
    return "Good Evening";
  };
  const firstName = currentUser?.displayName?.split(" ")[0] || "Member";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setPasswordInput("");
    setNewPasswordInput("");
    setNameInput("");
    setModalStatus({ type: "", message: "" });
  };

  // --- ACTIONS ---

  const handleNameChange = async (e) => {
    e.preventDefault();
    setModalStatus({ type: "", message: "" });
    setIsLoading(true);
    try {
      await updateProfile(currentUser, { displayName: nameInput });
      setModalStatus({
        type: "success",
        message: "Name updated successfully!",
      });
      setTimeout(closeModal, 1500);
    } catch (error) {
      setModalStatus({ type: "error", message: "Failed to update name." });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setModalStatus({ type: "", message: "" });
    setIsLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordInput,
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPasswordInput);
      setModalStatus({
        type: "success",
        message: "Password updated successfully!",
      });
      setTimeout(closeModal, 1500);
    } catch (error) {
      setModalStatus({
        type: "error",
        message: "Error: Current password incorrect.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setModalStatus({ type: "", message: "" });
    setIsLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordInput,
      );
      await reauthenticateWithCredential(currentUser, credential);
      await deleteUser(currentUser);
      navigate("/");
    } catch (error) {
      setModalStatus({ type: "error", message: "Error: Password incorrect." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="container mt-4 mb-5">
        {/* Header Greeting Row */}
        <div className="row mb-2">
          <div className="col-12">
            <PageHeader
              icon="settings"
              title="Settings"
              subtitle="Choose a settings category from below."
            />
          </div>
        </div>

        <div className="row g-2">
          {/* Left Column: Account Profile */}
          <div className="col-12 col-md-6">
            <Card bodyClass="text-center py-4">
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primaryContainer)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px solid var(--primary)",
                  margin: "0 auto 15px",
                }}
              >
                <span
                  className="material-symbols-rounded"
                  style={{ fontSize: "50px" }}
                >
                  person
                </span>
              </div>
              <h2 className="card-title mb-0" style={{ fontSize: "1.5rem" }}>
                {currentUser?.displayName || "HiOS User"}
              </h2>
              <p className="mb-4">{currentUser?.email}</p>

              <div className="text-start">
                <MenuActionBtn
                  icon="badge"
                  text="Change name"
                  className="joinTop"
                  onClick={() => setActiveModal("name")}
                />
                <MenuActionBtn
                  icon="password"
                  text="Change password"
                  className="joinMiddle"
                  onClick={() => setActiveModal("password")}
                />
                <MenuActionBtn
                  icon="logout"
                  text="Log-out"
                  className="joinMiddle"
                  onClick={handleLogout}
                />
                <MenuActionBtn
                  icon="warning"
                  text="Delete HiAccount"
                  className="joinBottom"
                  onClick={() => setActiveModal("delete")}
                />
              </div>
            </Card>
          </div>

          {/* Right Column: Settings Categories */}
          <div className="col-12 col-md-6">
            <Card title="Customisation">
              <MenuActionBtn
                icon="palette"
                text="Appearance"
                className="joinTop"
                onClick={() => navigate("/settings/appearance")}
              />
              <MenuActionBtn
                icon="accessibility"
                text="Accessibility"
                className="joinBottom"
                onClick={() => navigate("/settings/accessibility")}
              />
            </Card>

            <Card className="mt-2" title="General">
              <MenuActionBtn
                icon="dashboard_customize"
                text="Apps and websites"
                className="full"
                onClick={() => navigate("/settings/apps")}
              />
            </Card>

            <Card className="mt-2" title="Updates and more">
              <MenuActionBtn
                icon="system_update"
                text="Updates"
                className="joinTop"
                onClick={() => navigate("/settings/updates")}
              />
              <MenuActionBtn
                icon="info"
                text="About"
                className="joinMiddle"
                onClick={() => navigate("/settings/about")}
              />
              <MenuActionBtn
                icon="security"
                text="Privacy policy"
                className="joinBottom"
                onClick={() => navigate("/settings/privacy")}
              />
            </Card>
          </div>
        </div>
      </main>

      {/* Dynamic Modal Overlay */}
      {activeModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "15px",
          }}
        >
          <Card
            className="full p-4"
            style={{ maxWidth: "450px", width: "100%" }}
          >
            <h2
              className="card-title mb-3"
              style={{ fontSize: "1.5rem", textAlign: "left" }}
            >
              {activeModal === "name" && "Change Name"}
              {activeModal === "password" && "Change Password"}
              {activeModal === "delete" && "Delete Account"}
            </h2>

            {modalStatus.message && (
              <div
                className="infoBubble text-start mb-3"
                style={{
                  backgroundColor:
                    modalStatus.type === "success"
                      ? "var(--primaryContainer)"
                      : "var(--errorContainer)",
                  color:
                    modalStatus.type === "success"
                      ? "var(--onPrimaryContainer)"
                      : "var(--onErrorContainer)",
                }}
              >
                {modalStatus.message}
              </div>
            )}

            <form
              onSubmit={
                activeModal === "name"
                  ? handleNameChange
                  : activeModal === "password"
                    ? handlePasswordChange
                    : handleDeleteAccount
              }
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {activeModal === "name" && (
                <input
                  type="text"
                  className="form-control"
                  placeholder="New Full Name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  required
                />
              )}

              {activeModal === "password" && (
                <>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Current Password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="New Password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    required
                    minLength="6"
                  />
                </>
              )}

              {activeModal === "delete" && (
                <>
                  <p className="text-start text-muted mb-2">
                    This is permanent. Enter your password to confirm deletion.
                  </p>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                  />
                </>
              )}

              <div className="d-flex gap-2 mt-4">
                <button
                  type="button"
                  className="navButtonInactive flex-grow-1"
                  onClick={closeModal}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <RippleButton
                  type="submit"
                  className="form-button m-0 flex-grow-1"
                  style={{
                    backgroundColor:
                      activeModal === "delete"
                        ? "var(--error)"
                        : "var(--primary)",
                    color: "var(--onPrimary)",
                  }}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processing..."
                    : activeModal === "delete"
                      ? "Delete Forever"
                      : "Save Changes"}
                </RippleButton>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
