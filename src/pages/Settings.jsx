import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBarWrapper from "../../components/TopBarWrapper";
import { Modal, ProfileHeader, TextInput } from "../../components/HiMaterial";
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

  // Navigation State
  const [activePivot, setActivePivot] = useState("account");

  // Modal & Form State
  const [activeModal, setActiveModal] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [modalStatus, setModalStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  // --- FIREBASE HANDLERS ---

  const closeModal = () => {
    setActiveModal(null);
    setPasswordInput("");
    setNewPasswordInput("");
    setNameInput("");
    setModalStatus({ type: "", message: "" });
  };

  const handleNameChange = async (e) => {
    e.preventDefault();
    setModalStatus({ type: "", message: "" });
    setIsLoading(true);
    try {
      await updateProfile(currentUser, { displayName: nameInput });
      setModalStatus({
        type: "success",
        message: "name updated successfully!",
      });
      setTimeout(closeModal, 1500);
    } catch (error) {
      setModalStatus({ type: "error", message: "failed to update name." });
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
        message: "password updated successfully!",
      });
      setTimeout(closeModal, 1500);
    } catch (error) {
      setModalStatus({
        type: "error",
        message: "error: current password incorrect.",
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
      setModalStatus({ type: "error", message: "error: password incorrect." });
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI COMPONENTS ---

  const SettingItem = ({ title, subtitle, onClick, delay }) => (
    <div className={`metro-anim-list-item delay-${delay}`}>
      <button className="settings-item" onClick={onClick}>
        <span className="item-title">{title}</span>
        {subtitle && <span className="item-sub">{subtitle}</span>}
      </button>
    </div>
  );

  return (
    <TopBarWrapper title="settings" hideTitle={true}>
      {/* GIANT PIVOT HEADERS */}
      <div className="pivot-container metro-anim-list-item delay-1">
        <div className="pivot-header-row">
          <button
            className={`pivot-link ${activePivot === "account" ? "active" : ""}`}
            onClick={() => setActivePivot("account")}
          >
            <h2>account</h2>
          </button>
          <button
            className={`pivot-link ${activePivot === "app" ? "active" : ""}`}
            onClick={() => setActivePivot("app")}
          >
            <h2>application</h2>
          </button>
          <button
            className={`pivot-link ${activePivot === "about" ? "active" : ""}`}
            onClick={() => setActivePivot("about")}
          >
            <h2>about</h2>
          </button>
        </div>
      </div>

      {/* --- ACCOUNT VIEW --- */}
      {activePivot === "account" && (
        <div className="wp-anim-in">
          <ProfileHeader
            name={currentUser?.displayName?.toLowerCase()}
            email={currentUser?.email}
          />
          <div className="metro-settings-list" style={{ marginTop: "20px" }}>
            <SettingItem
              delay="1"
              title="change name"
              subtitle="update your display name"
              onClick={() => setActiveModal("name")}
            />
            <SettingItem
              delay="2"
              title="security"
              subtitle="change your login password"
              onClick={() => setActiveModal("password")}
            />
            <SettingItem
              delay="3"
              title="log-out"
              subtitle={`signed in as ${currentUser?.email}`}
              onClick={() => logout().then(() => navigate("/"))}
            />
            <div className="settings-group-label metro-anim-list-item delay-4">
              danger zone
            </div>
            <SettingItem
              delay="5"
              title="delete account"
              subtitle="permanently erase your hios data"
              onClick={() => setActiveModal("delete")}
            />
          </div>
        </div>
      )}

      {/* --- APPLICATION VIEW --- */}
      {activePivot === "app" && (
        <div className="wp-anim-in">
          <div className="metro-settings-list">
            <div className="settings-group-label">visuals</div>
            <SettingItem
              delay="1"
              title="appearance"
              subtitle="accent color, theme, and background"
              onClick={() => navigate("/settings/appearance")}
            />

            <div className="settings-group-label">data</div>
            <SettingItem
              delay="3"
              title="sync"
              subtitle="cloud backup and account data"
              onClick={() => navigate("/settings/sync")}
            />
            <SettingItem
              delay="4"
              title="apps"
              subtitle="manage pinned dashboard content"
              onClick={() => navigate("/settings/apps")}
            />
          </div>
        </div>
      )}

      {/* --- ABOUT VIEW --- */}
      {activePivot === "about" && (
        <div className="wp-anim-in">
          <div className="metro-settings-list">
            <SettingItem
              delay="1"
              title="updates"
              subtitle="hios is up to date (v2.4.1)"
              onClick={() => navigate("/settings/updates")}
            />
            <SettingItem
              delay="2"
              title="legal"
              subtitle="privacy policy and terms of service"
              onClick={() => navigate("/settings/privacy")}
            />
            <SettingItem
              delay="3"
              title="system info"
              subtitle="device and software details"
              onClick={() => navigate("/settings/about")}
            />
            <div className="settings-group-label">credits</div>
            <p
              style={{
                color: "var(--subtext)",
                padding: "10px 0",
                fontSize: "1.1rem",
              }}
            >
              designed by the hios team. built for the modern web with a classic
              soul.
            </p>
          </div>
        </div>
      )}

      {/* --- FUNCTIONAL METRO MODALS --- */}
      <Modal
        isOpen={!!activeModal}
        title={
          activeModal === "name"
            ? "change name"
            : activeModal === "password"
              ? "security"
              : activeModal === "delete"
                ? "delete account"
                : ""
        }
      >
        {/* Status Messages */}
        {modalStatus.message && (
          <div
            style={{
              padding: "12px",
              backgroundColor:
                modalStatus.type === "success"
                  ? "var(--accent)"
                  : "var(--metro-red)",
              color: "#fff",
              marginBottom: "20px",
              fontSize: "1rem",
              textTransform: "lowercase",
              fontWeight: "600",
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
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {activeModal === "name" && (
              <TextInput
                placeholder="new full name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
              />
            )}

            {activeModal === "password" && (
              <>
                <TextInput
                  type="password"
                  placeholder="current password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
                <TextInput
                  type="password"
                  placeholder="new password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  required
                  minLength="6"
                />
              </>
            )}

            {activeModal === "delete" && (
              <>
                <p
                  style={{
                    color: "var(--subtext)",
                    fontSize: "1rem",
                    marginBottom: "10px",
                  }}
                >
                  this is permanent. enter your password to confirm.
                </p>
                <TextInput
                  type="password"
                  placeholder="confirm password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
              </>
            )}

            {/* Flat Metro Action Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                type="button"
                className="button"
                onClick={closeModal}
                disabled={isLoading}
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  color: "var(--onBackground)",
                }}
              >
                cancel
              </button>
              <button
                type="submit"
                className="button"
                disabled={isLoading}
                style={{
                  flex: 1,
                  backgroundColor:
                    activeModal === "delete"
                      ? "var(--metro-red)"
                      : "var(--accent)",
                  color: "#fff",
                  border: "none",
                }}
              >
                {isLoading ? "working..." : "save"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </TopBarWrapper>
  );
}
