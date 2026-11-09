import React, { useState, useRef } from "react";
import { Card, TextInput, Dropdown, RippleButton, InfoBubble } from "../../../components/HiMaterial";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../src/firebase";
import { useAuth } from "../../../src/AuthContext";

export default function BookRoom() {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const isSubmitting = useRef(false);

  // Tracks the current page (1, 2, or 3)
  const [currentPage, setCurrentPage] = useState(1);

  const defaultFirstName = currentUser?.displayName?.split(" ")[0] || "";
  const defaultLastName = currentUser?.displayName?.split(" ").slice(1).join(" ") || "";

  const [formData, setFormData] = useState({
    firstName: defaultFirstName,
    lastName: defaultLastName,
    dob: "",
    email: currentUser?.email || "",
    phone: "",
    startDate: "",
    endDate: "",
    nights: 1,
    roomType: "Double En-suite",
    roomCount: 1,
    accessible: "No",
    anythingElse: "No",
    tellUs: ""
  });

  const today = new Date().toISOString().split("T")[0];

  const roomOptions = [
    "Single En-suite",
    "Double En-suite",
    "Twin En-suite",
    "Family En-suite"
  ].map(type => ({ label: type, value: type }));

  const yesNoOptions = ["Yes", "No"].map(opt => ({ label: opt, value: opt }));

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage("");
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setErrorMessage("");
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextOrSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload, triggers native required validation

    if (currentPage === 1) {
      // Move to page 2
      setCurrentPage(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentPage === 2) {
      // Validate Custom Stay Rules
      if (Number(formData.nights) < 0 || Number(formData.nights) > 14) {
        setErrorMessage("Number of nights must be between 0 and 14.");
        return;
      }
      if (Number(formData.roomCount) < 1 || Number(formData.roomCount) > 4) {
        setErrorMessage("Number of rooms required must be between 1 and 4.");
        return;
      }

      setErrorMessage("");
      setCurrentPage(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentPage === 3) {
      // Validate Anything Else Rules & Submit
      if (formData.anythingElse === "Yes" && !formData.tellUs.trim()) {
        setErrorMessage("Please provide details for your special request.");
        return;
      }

      if (isSubmitting.current) return;
      isSubmitting.current = true;
      setStatus("submitting");
      setErrorMessage("");

      try {
        await addDoc(collection(db, "hotel_bookings"), {
          customerName: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dob: formData.dob,
          email: formData.email,
          phone: formData.phone,
          startDate: formData.startDate,
          endDate: formData.endDate,
          nights: Number(formData.nights),
          roomType: formData.roomType,
          roomCount: Number(formData.roomCount),
          accessibleRoom: formData.accessible,
          additionalNotes: formData.anythingElse === "Yes" ? formData.tellUs : "",
          createdAt: serverTimestamp(),
          status: "pending"
        });

        setStatus("success");
        setFormData({
          firstName: defaultFirstName,
          lastName: defaultLastName,
          dob: "",
          email: currentUser?.email || "",
          phone: "",
          startDate: "",
          endDate: "",
          nights: 1,
          roomType: "Double En-suite",
          roomCount: 1,
          accessible: "No",
          anythingElse: "No",
          tellUs: ""
        });
        setCurrentPage(1); // Reset back to page 1 for the next booking
      } catch (error) {
        console.error("Firebase Error:", error);
        setStatus("error");
        setErrorMessage("Network error. Please check your connection and try again.");
      } finally {
        isSubmitting.current = false;
        if (status !== "success") setStatus("idle");
      }
    }
  };

  if (status === "success") {
    return (
      <Card className="text-center joinTop" bodyClass="p-4">
        <span className="material-symbols-rounded imageIcon mb-2" style={{ color: "var(--primary)" }}>
          check_circle
        </span>
        <h3 className="card-title text-center mb-2">booking received!</h3>
        <p className="subtitle mb-3">We look forward to hosting your stay at WorstEastern.</p>
        <RippleButton className="metro-list-btn" onClick={() => setStatus("idle")}>
          <span className="button-text">New Booking</span>
        </RippleButton>
      </Card>
    );
  }

  return (
    <InfoBubble className="full text-start">
      <form onSubmit={handleNextOrSubmit} className="settings-group g-3">

        {/* --- PAGE 1: YOUR DETAILS --- */}
        <div style={{ display: currentPage === 1 ? "block" : "none" }} className="metro-anim-list-item delay-1">
          <div>
            <span className="opacity-75 fw-bold" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>Step 1 of 3</span>
            <h4 className="blue-h3 mb-2 mt-1" style={{ fontSize: "1.3rem" }}>Your Details</h4>
            <p className="opacity-75 mb-3" style={{ fontSize: "0.85rem" }}>Please enter your personal details</p>
          </div>

          <div className="d-flex gap-2">
            <div className="flex-grow-1">
              <label className="form-check-label mb-1">First Name *</label>
              <TextInput
                className="full-btn"
                type="text"
                required={currentPage === 1}
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>
            <div className="flex-grow-1">
              <label className="form-check-label mb-1">Last Name *</label>
              <TextInput
                className="full-btn"
                type="text"
                required={currentPage === 1}
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-check-label mb-1">Date of Birth *</label>
            <TextInput
              className="full-btn"
              type="date"
              required={currentPage === 1}
              value={formData.dob}
              onChange={(e) => handleChange("dob", e.target.value)}
            />
          </div>

          <div>
            <label className="form-check-label mb-1">Email address *</label>
            <TextInput
              className="full-btn"
              type="email"
              required={currentPage === 1}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div>
            <label className="form-check-label mb-1">Contact number *</label>
            <TextInput
              className="full-btn"
              type="tel"
              required={currentPage === 1}
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
        </div>

        {/* --- PAGE 2: YOUR STAY --- */}
        <div style={{ display: currentPage === 2 ? "block" : "none" }} className="metro-anim-list-item delay-1">
          <div>
            <span className="opacity-75 fw-bold" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>Step 2 of 3</span>
            <h4 className="blue-h3 mb-2 mt-1" style={{ fontSize: "1.3rem" }}>Your Stay</h4>
            <p className="opacity-75 mb-3" style={{ fontSize: "0.85rem" }}>Enter your stay details</p>
          </div>

          <div className="d-flex gap-2">
            <div className="flex-grow-1">
              <label className="form-check-label mb-1">Start date *</label>
              <TextInput
                className="full-btn"
                type="date"
                required={currentPage === 2}
                min={today}
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>
            <div className="flex-grow-1">
              <label className="form-check-label mb-1">End date *</label>
              <TextInput
                className="full-btn"
                type="date"
                required={currentPage === 2}
                min={formData.startDate || today}
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-check-label mb-1">Number of nights staying *</label>
            <p className="opacity-75 mb-1" style={{ fontSize: "0.75rem" }}>Number must be between 0 ~ 14</p>
            <TextInput
              className="full-btn"
              type="number"
              min="0"
              max="14"
              required={currentPage === 2}
              value={formData.nights}
              onChange={(e) => handleChange("nights", e.target.value)}
            />
          </div>

          <div>
            <label className="form-check-label mb-1">Type of room *</label>
            <p className="opacity-75 mb-1" style={{ fontSize: "0.75rem" }}>All rooms are en-suite</p>
            <Dropdown
              className="full-btn"
              options={roomOptions}
              value={formData.roomType}
              onChange={(val) => handleChange("roomType", val)}
            />
          </div>

          <div>
            <label className="form-check-label mb-1">How many rooms do you require? *</label>
            <p className="opacity-75 mb-1" style={{ fontSize: "0.75rem" }}>Number must be between 1 ~ 4</p>
            <TextInput
              className="full-btn"
              type="number"
              min="1"
              max="4"
              required={currentPage === 2}
              value={formData.roomCount}
              onChange={(e) => handleChange("roomCount", e.target.value)}
            />
          </div>
        </div>

        {/* --- PAGE 3: ANYTHING ELSE --- */}
        <div style={{ display: currentPage === 3 ? "block" : "none" }} className="metro-anim-list-item delay-1">
          <div>
            <span className="opacity-75 fw-bold" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>Step 3 of 3</span>
            <h4 className="blue-h3 mb-2 mt-1" style={{ fontSize: "1.3rem" }}>Anything Else?</h4>
            <p className="opacity-75 mb-3" style={{ fontSize: "0.85rem" }}>Enter anything else you need</p>
          </div>

          <div>
            <label className="form-check-label mb-1">Do you need an accessible room? *</label>
            <Dropdown
              className="full-btn"
              options={yesNoOptions}
              value={formData.accessible}
              onChange={(val) => handleChange("accessible", val)}
            />
          </div>

          <div>
            <label className="form-check-label mb-1">Anything else? *</label>
            <Dropdown
              className="full-btn"
              options={yesNoOptions}
              value={formData.anythingElse}
              onChange={(val) => handleChange("anythingElse", val)}
            />
          </div>

          {/* CONDITIONAL TELL US SECTION */}
          {formData.anythingElse === "Yes" && (
            <div className="mt-2 p-3 rounded" style={{ backgroundColor: "color-mix(in srgb, var(--primaryContainer) 40%, transparent)" }}>
              <h4 className="blue-h3 mb-1" style={{ fontSize: "1.1rem" }}>You answered 'Yes' to Anything Else</h4>
              <p className="opacity-75 mb-2" style={{ fontSize: "0.85rem" }}>Tell us below.</p>

              <label className="form-check-label mb-1">Tell us *</label>
              <TextInput
                className="full-btn"
                type="text"
                placeholder="Enter special requests here..."
                required={currentPage === 3 && formData.anythingElse === "Yes"}
                value={formData.tellUs}
                onChange={(e) => handleChange("tellUs", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* --- ERROR MESSAGE --- */}
        {errorMessage && (
          <div className="infoBubble red mt-2">
            {errorMessage}
          </div>
        )}

        {/* --- NAVIGATION BUTTONS --- */}
        <div className="d-flex gap-2 mt-4 pt-3 border-top border-secondary border-opacity-25">
          {currentPage > 1 && (
            <RippleButton
              type="button"
              className="metro-list-btn m-0 flex-grow-1"
              style={{ backgroundColor: "var(--secondaryContainer)", color: "var(--onSecondaryContainer)" }}
              onClick={handleBack}
            >
              <span className="material-symbols-rounded">arrow_back</span>
              <span className="button-text">Back</span>
            </RippleButton>
          )}

          <RippleButton
            type="submit"
            className="metro-list-btn m-0 flex-grow-1"
            disabled={status === "submitting"}
          >
            <span className="button-text">{currentPage === 3 ? (status === "submitting" ? "Sending..." : "Book Room") : "Next"}</span>
            {currentPage < 3 && <span className="material-symbols-rounded">arrow_forward</span>}
            {currentPage === 3 && <span className="material-symbols-rounded">bed</span>}
          </RippleButton>
        </div>

      </form>
    </InfoBubble>
  );
}
