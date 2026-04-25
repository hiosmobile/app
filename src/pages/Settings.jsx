import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  Card,
  MenuActionBtn,
  RippleButton,
  Row,
  Col,
  Modal,
  ProfileHeader,
} from "../../components/HiMaterial";
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
        <Row className="mb-2">
          <Col size={12}>
            <PageHeader
              icon="settings"
              title="Settings"
              subtitle="Choose a settings category from below."
            />
          </Col>
        </Row>

        <Row className="g-2">
          {/* Left Column: Account Profile */}
          {/* Left Column: Account Profile */}
          <Col size={12} md={6}>
            <ProfileHeader
              name={currentUser?.displayName}
              email={currentUser?.email}
              className="joinTop"
            />
            <Card className="joinMiddle">
              <div className="text-start mt-1">
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

            <Card className="joinBottom" title="Sync your settings">
              <MenuActionBtn
                icon="cloud_sync"
                text="Backup and sync"
                onClick={() => navigate("/settings/sync")}
              />
            </Card>
          </Col>

          {/* Right Column: Settings Categories */}
          <Col size={12} md={6}>
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
          </Col>
        </Row>
      </main>

      {/* Dynamic Modal Overlay */}
      <Modal
        isOpen={!!activeModal}
        title={
          activeModal === "name"
            ? "Change Name"
            : activeModal === "password"
              ? "Change Password"
              : activeModal === "delete"
                ? "Delete Account"
                : ""
        }
      >
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

          <div className="d-flex gap-1 mt-4">
            <button
              type="button"
              className="joinLeft navButtonInactive flex-grow-1"
              onClick={closeModal}
              disabled={isLoading}
              style={{ width: "100px" }}
            >
              Cancel
            </button>
            <RippleButton
              type="submit"
              className="joinRight form-button m-0 flex-grow-1"
              style={{
                backgroundColor:
                  activeModal === "delete" ? "var(--error)" : "var(--primary)",
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
      </Modal>
    </>
  );
}
