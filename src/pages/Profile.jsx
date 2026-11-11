import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  updateProfile,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";
import Cropper from "react-easy-crop"; // <-- The new cropper library
import {
  Card, Row, Col, PageHeader, MenuActionBtn,
  ProfileHeader, Modal, RippleButton,
} from "../../components/HiMaterial";

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const fileInputRef = useRef(null);

  // General State
  const [activeModal, setActiveModal] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [modalStatus, setModalStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  // Cropper State
  const [rawImage, setRawImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    const fetchProfilePic = async () => {
      if (!currentUser) return;
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists() && userDoc.data().photoString) {
          setProfilePic(userDoc.data().photoString);
          return;
        }
        if (currentUser.photoURL) {
          let highResPic = currentUser.photoURL;
          if (highResPic.includes("=s96-c")) highResPic = highResPic.replace("=s96-c", "=s400-c");
          setProfilePic(highResPic);
        }
      } catch (err) {
        console.error("Error fetching profile pic:", err);
      }
    };
    fetchProfilePic();
  }, [currentUser]);

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
    setRawImage(null); // Clear cropper state
  };

  // 1. User picks a file, we load it into rawImage, and open the Crop Modal
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please choose an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setRawImage(event.target.result);
      setActiveModal("crop");
    };
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 2. User confirms the crop, we draw exactly what they cropped and save to Firestore
  const handleSaveCrop = async () => {
    if (!rawImage || !croppedAreaPixels) return;
    setIsLoading(true);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.src = rawImage;

      await new Promise((resolve) => (image.onload = resolve));

      // Force output to 150x150 so it stays perfectly small for Firestore
      canvas.width = 150;
      canvas.height = 150;

      ctx.drawImage(
        image,
        croppedAreaPixels.x, croppedAreaPixels.y,
        croppedAreaPixels.width, croppedAreaPixels.height,
        0, 0,
        150, 150
      );

      const base64String = canvas.toDataURL("image/jpeg", 0.6);

      await setDoc(doc(db, "users", currentUser.uid), { photoString: base64String }, { merge: true });
      setProfilePic(base64String);
      closeModal();
    } catch (error) {
      alert("Failed to upload profile picture. Ensure you are connected to the internet.");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleNameChange = async (e) => {
    e.preventDefault();
    setModalStatus({ type: "", message: "" });
    setIsLoading(true);
    try {
      await updateProfile(currentUser, { displayName: nameInput });
      setModalStatus({ type: "success", message: "Name updated successfully!" });
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
      const credential = EmailAuthProvider.credential(currentUser.email, passwordInput);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPasswordInput);
      setModalStatus({ type: "success", message: "Password updated successfully!" });
      setTimeout(closeModal, 1500);
    } catch (error) {
      setModalStatus({ type: "error", message: "Error: Current password incorrect." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setModalStatus({ type: "", message: "" });
    setIsLoading(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, passwordInput);
      await reauthenticateWithCredential(currentUser, credential);
      await deleteUser(currentUser);
      navigate("/");
    } catch (error) {
      setModalStatus({ type: "error", message: "Error: Password incorrect." });
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = currentUser?.email === "jefaar80@gmail.com";

  // Chunky Segmented Block Style (Removed internal border-radius so the joins work natively)
  const chunkyChipStyle = {
    backgroundColor: "var(--primary)",
    color: "var(--onPrimary)",
    border: "none",
    height: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "2px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    textTransform: "lowercase"
  };

  return (
    <>
      <main className="container mt-4 mb-5">
        <Row>
          <Col size={12}>
            <PageHeader
              title="You"
              subtitle="See your account overview and more below."
              className="joinTop pb-3 metro-anim-list-item delay-1"
            />
          </Col>
        </Row>

        <Row className="g-1">
          {/* --- LEFT COLUMN --- */}
          <Col size={12} md={6}>
            <input
              type="file" accept="image/*" ref={fileInputRef}
              style={{ opacity: 0, position: "absolute", zIndex: -1, width: "1px", height: "1px" }}
              onChange={onFileChange}
            />

            <ProfileHeader
              name={currentUser?.displayName}
              email={currentUser?.email}
              photoURL={profilePic}
              onPfpClick={() => !isLoading && fileInputRef.current.click()}
              isUploading={isLoading}
              className="joinMiddle metro-anim-list-item delay-2"
            >
              {/* Perfectly joined primary-colored chips */}
              <div className="d-flex w-100 px-4 mt-2 gap-1">
                <RippleButton
                  type="button"
                  className="flex-grow-1 m-0 joinLeft"
                  style={chunkyChipStyle}
                  onClick={() => setActiveModal("name")}
                >
                  <span className="material-symbols-rounded" style={{ fontSize: "24px" }}>badge</span>
                </RippleButton>

                <RippleButton
                  type="button"
                  className="flex-grow-1 m-0 joinMiddle"
                  style={{ ...chunkyChipStyle, borderLeft: "1px solid rgba(0,0,0,0.15)" }} // Subtle divider
                  onClick={() => setActiveModal("password")}
                >
                  <span className="material-symbols-rounded" style={{ fontSize: "24px" }}>password</span>
                </RippleButton>

                <RippleButton
                  type="button"
                  className="flex-grow-1 m-0 joinRight"
                  style={{ ...chunkyChipStyle, borderLeft: "1px solid rgba(0,0,0,0.15)" }}
                  onClick={handleLogout}
                >
                  <span className="material-symbols-rounded" style={{ fontSize: "24px" }}>logout</span>
                </RippleButton>
              </div>
            </ProfileHeader>

            <Card className="joinBottomLeft  metro-anim-list-item delay-3" title="Your experience">
              <div className="text-start mt-1">
                <MenuActionBtn icon="palette" text="Themes" className="joinTop" onClick={() => navigate("/settings/appearance")} />
                <MenuActionBtn icon="accessibility" text="Ease of access" className="joinMiddle" onClick={() => navigate("/settings/accessibility")} />
                <MenuActionBtn icon="cloud_sync" text="Backup and sync" className="joinBottom" onClick={() => navigate("/settings/sync")} />
              </div>
            </Card>
          </Col>

          {/* --- RIGHT COLUMN --- */}
          <Col size={12} md={6}>

            {isAdmin && (
              <Card title="For staff" className="rightColJoinTop metro-anim-list-item delay-4">
                <MenuActionBtn icon="admin_panel_settings" text="Admin Dashboard" className="full" onClick={() => navigate("/admin")} />
              </Card>
            )}

            <Card title="Support & Legal" className={isAdmin ? "joinMiddle metro-anim-list-item delay-5" : "rightColJoinTop metro-anim-list-item delay-5"}>
              <div className="text-start mt-1">
                <MenuActionBtn icon="help" text="Help" className="joinTop" onClick={() => navigate("/help")} />
                <MenuActionBtn icon="info" text="About" className="joinMiddle" onClick={() => navigate("/settings/about")} />
                <MenuActionBtn icon="security" text="Privacy" className="joinBottom" onClick={() => navigate("/settings/privacy")} />
              </div>
            </Card>

            <Card className="joinBottomRight metro-anim-list-item delay-6" title="The danger zone">
               <MenuActionBtn icon="warning" text="Delete HiAccount" className="red full" onClick={() => setActiveModal("delete")} />
            </Card>
          </Col>
        </Row>
      </main>

      {/* Main Settings Modals */}
      <Modal
        isOpen={!!activeModal && activeModal !== "crop"}
        appName="Account Settings"
        title={ activeModal === "name" ? "Change Name" : activeModal === "password" ? "Change Password" : activeModal === "delete" ? "Delete Account" : "" }
      >
        {modalStatus.message && (
          <div
            className="infoBubble text-start mb-3"
            style={{
              backgroundColor: modalStatus.type === "success" ? "var(--primaryContainer)" : "var(--errorContainer)",
              color: modalStatus.type === "success" ? "var(--onPrimaryContainer)" : "var(--onErrorContainer)",
            }}
          >
            {modalStatus.message}
          </div>
        )}

        <form onSubmit={activeModal === "name" ? handleNameChange : activeModal === "password" ? handlePasswordChange : handleDeleteAccount} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {activeModal === "name" && (
            <input type="text" className="form-control full" placeholder="New Full Name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} required />
          )}

          {activeModal === "password" && (
            <>
              <input type="password" className="form-control joinTop" placeholder="Current Password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required />
              <input type="password" className="form-control joinBottom" placeholder="New Password" value={newPasswordInput} onChange={(e) => setNewPasswordInput(e.target.value)} required minLength="6" />
            </>
          )}

          {activeModal === "delete" && (
            <>
              <p className="text-start text-muted mb-2">This is permanent. Enter your password to confirm deletion.</p>
              <input type="password" className="form-control full" placeholder="Confirm Password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required />
            </>
          )}

          <div className="d-flex gap-1 mt-4">
            <button type="button" className="joinLeft navButtonInactive flex-grow-1" onClick={closeModal} disabled={isLoading} style={{ width: "100px" }}>Cancel</button>
            <RippleButton
              type="submit" className="joinRight form-button m-0 flex-grow-1"
              style={{ backgroundColor: activeModal === "delete" ? "var(--error)" : "var(--primary)", color: "var(--onPrimary)" }}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : activeModal === "delete" ? "Delete Forever" : "Save Changes"}
            </RippleButton>
          </div>
        </form>
      </Modal>

      {/* Social Media Style Cropper Modal */}
      <Modal
        isOpen={activeModal === "crop"}
        appName="Profile Picture"
        title="Crop Image"
      >
        <div style={{ position: "relative", width: "100%", height: "300px", backgroundColor: "#333", borderRadius: "12px", overflow: "hidden" }}>
          {rawImage && (
            <Cropper
              image={rawImage}
              crop={crop}
              zoom={zoom}
              aspect={1} // Forces a perfect square crop
              cropShape="round" // Gives the user a visual circular guide
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          )}
        </div>

        <div className="mt-3 text-start">
          <label className="fw-bold opacity-75 mb-1 d-block" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>Adjust Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="w-100"
            style={{ accentColor: "var(--primary)" }}
          />
        </div>

        <div className="d-flex gap-1 mt-4">
          <button type="button" className="joinLeft navButtonInactive flex-grow-1" onClick={closeModal} disabled={isLoading}>Cancel</button>
          <RippleButton
            type="button" className="joinRight form-button m-0 flex-grow-1"
            style={{ backgroundColor: "var(--primary)", color: "var(--onPrimary)" }}
            onClick={handleSaveCrop}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Set Picture"}
          </RippleButton>
        </div>
      </Modal>
    </>
  );
}
