import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        message: "Failed to update. Check your current password.",
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
      // Firebase automatically logs the user out upon deletion
      navigate("/");
    } catch (error) {
      setModalStatus({
        type: "error",
        message: "Failed to delete account. Check your password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="container mt-4 mb-5">
        <div className="row mb-2">
          <div className="col-12">
            <Card>
              <div className="top-container">
                <h1 className="blue-h2">
                  <span className="titleIcon material-symbols-rounded">
                    settings
                  </span>
                  Settings
                </h1>
                <p id="para" className="subtitle mb-0">
                  Choose a settings category from below.
                </p>
              </div>
            </Card>
          </div>
        </div>

        <div className="row g-2">
          {/* Left Column */}
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
                {currentUser?.displayName || "HiOS Member"}
              </h2>
              <p className="text-muted mb-4">{currentUser?.email}</p>

              <div className="text-start">
                <MenuActionBtn
                  icon="badge"
                  text="Change Name"
                  className="joinTop"
                  onClick={() => setActiveModal("name")}
                />
                <MenuActionBtn
                  icon="password"
                  text="Change Password"
                  className="joinMiddle"
                  onClick={() => setActiveModal("password")}
                />
                <MenuActionBtn
                  icon="logout"
                  text="Log-Out"
                  className="joinMiddle"
                  onClick={handleLogout}
                />
                <MenuActionBtn
                  icon="person_remove"
                  text="Delete HiAccount"
                  className="joinBottom"
                  onClick={() => setActiveModal("delete")}
                />
              </div>
            </Card>
          </div>

          {/* Right Column */}
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
                text="Apps and Websites"
                className="full"
                onClick={() => navigate("/settings/apps")}
              />
            </Card>
            <Card className="mt-2" title="About">
              <MenuActionBtn
                icon="info"
                text="About HiOS"
                className="joinTop"
                onClick={() => navigate("/settings/about")}
              />
              <MenuActionBtn
                icon="security"
                text="Privacy Policy"
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
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "15px",
          }}
        >
          <Card
            className="full p-4"
            style={{ maxWidth: "400px", width: "100%" }}
          >
            <h2 className="mb-3" style={{ fontSize: "1.25rem" }}>
              {activeModal === "name" && "Change Name"}
              {activeModal === "password" && "Change Password"}
              {activeModal === "delete" && "Delete Account"}
            </h2>

            {modalStatus.message && (
              <div
                className={`alert ${modalStatus.type === "success" ? "alert-success" : "alert-danger"}`}
                style={{
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "0.9rem",
                  marginBottom: "15px",
                }}
              >
                {modalStatus.message}
              </div>
            )}

            {/* Change Name Form */}
            {activeModal === "name" && (
              <form
                onSubmit={handleNameChange}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="New Full Name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  required
                />
                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-light flex-grow-1 rounded-pill"
                    onClick={closeModal}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <RippleButton
                    type="submit"
                    className="button m-0 flex-grow-1"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Update"}
                  </RippleButton>
                </div>
              </form>
            )}

            {/* Change Password Form */}
            {activeModal === "password" && (
              <form
                onSubmit={handlePasswordChange}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
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
                  placeholder="New Password (min 6 chars)"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  required
                  minLength="6"
                />
                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-light flex-grow-1 rounded-pill"
                    onClick={closeModal}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <RippleButton
                    type="submit"
                    className="button m-0 flex-grow-1"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Update"}
                  </RippleButton>
                </div>
              </form>
            )}

            {/* Delete Account Form */}
            {activeModal === "delete" && (
              <form
                onSubmit={handleDeleteAccount}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  This action is permanent and cannot be undone. Please enter
                  your password to confirm.
                </p>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-light flex-grow-1 rounded-pill"
                    onClick={closeModal}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <RippleButton
                    type="submit"
                    className="button m-0 flex-grow-1"
                    style={{
                      backgroundColor: "var(--errorContainer)",
                      color: "var(--onErrorContainer)",
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Deleting..." : "Delete"}
                  </RippleButton>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
