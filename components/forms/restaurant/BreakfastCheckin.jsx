import React, { useState, useRef } from "react";
import { Card, TextInput, RippleButton, InfoBubble } from "../../../components/HiMaterial";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../src/firebase"; 
import { useAuth } from "../../../src/AuthContext";

export default function BreakfastCheckin() {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState("idle"); 
  const [errorMessage, setErrorMessage] = useState("");
  const isSubmitting = useRef(false);

  const defaultFirstName = currentUser?.displayName?.split(" ")[0] || "";
  const defaultLastName = currentUser?.displayName?.split(" ").slice(1).join(" ") || "";

  const [formData, setFormData] = useState({
    roomNo: "",
    firstName: defaultFirstName,
    lastName: defaultLastName,
    date: "",
    time: "",
    breakfastType: [],
    specialRequest: "" // Added state for the custom text input
  });

  const today = new Date().toISOString().split("T")[0];

  const breakfastOptions = [
    "Continental breakfast",
    "Cooked breakfast",
    "Breakfast rolls",
    "Other"
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage("");
  };

  const handleCheckboxChange = (option) => {
    setFormData(prev => {
      const currentTypes = prev.breakfastType;
      if (currentTypes.includes(option)) {
        return { ...prev, breakfastType: currentTypes.filter(item => item !== option) };
      } else {
        return { ...prev, breakfastType: [...currentTypes, option] };
      }
    });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.date === today) {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        if (formData.time < currentTime) {
            setErrorMessage("You cannot book a time in the past.");
            return;
        }
    }

    if (formData.breakfastType.length === 0) {
        setErrorMessage("Please select at least one kind of breakfast.");
        return;
    }

    if (formData.breakfastType.includes("Other") && !formData.specialRequest.trim()) {
        setErrorMessage("Please specify your special request.");
        return;
    }

    if (isSubmitting.current) return;

    isSubmitting.current = true;
    setStatus("submitting");
    setErrorMessage("");

    try {
      await addDoc(collection(db, "breakfast_checkin"), {
        roomNumber: formData.roomNo,
        firstName: formData.firstName,
        lastName: formData.lastName,
        customerName: currentUser?.displayName || "Guest",
        email: currentUser?.email || "Unknown",
        date: formData.date,
        time: formData.time,
        breakfastType: formData.breakfastType,
        additionalNotes: formData.breakfastType.includes("Other") ? formData.specialRequest : "", // Feeds directly to Admin Dashboard
        createdAt: serverTimestamp(),
        status: "pending"
      });
      
      setStatus("success");
      setFormData({
        roomNo: "",
        firstName: defaultFirstName,
        lastName: defaultLastName,
        date: "",
        time: "",
        breakfastType: [],
        specialRequest: ""
      });
    } catch (error) {
      console.error("Firebase Error:", error);
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      isSubmitting.current = false;
      if (status !== "success") setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <Card className="text-center joinTop" bodyClass="p-4">
        <span className="material-symbols-rounded imageIcon mb-2" style={{ color: "var(--primary)" }}>
          check_circle
        </span>
        <h3 className="card-title text-center mb-2">check-in complete!</h3>
        <p className="subtitle mb-3">Enjoy your breakfast at The Highland Cafe.</p>
        <RippleButton className="metro-list-btn" onClick={() => setStatus("idle")}>
          <span className="button-text">New Check-in</span>
        </RippleButton>
      </Card>
    );
  }

  return (
    <InfoBubble className="full text-start">
      <form onSubmit={handleSubmit} className="settings-group g-3">
        
        <div>
          <label className="form-check-label mb-1">What room do you stay in?*</label>
          <TextInput
            className="full-btn"
            type="text"
            required
            value={formData.roomNo}
            onChange={(e) => handleChange("roomNo", e.target.value)}
          />
        </div>

        <div>
          <label className="form-check-label mb-1">First name*</label>
          <TextInput
            className="full-btn"
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </div>
        
        <div>
          <label className="form-check-label mb-1">Surname*</label>
          <TextInput
            className="full-btn"
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </div>

        <div>
          <label className="form-check-label mb-1">Date*</label>
          <TextInput
            className="full-btn"
            type="date"
            required
            min={today}
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
        </div>
        
        <div>
          <label className="form-check-label mb-1">Time*</label>
          <TextInput
            className="full-btn"
            type="time"
            required
            value={formData.time}
            onChange={(e) => handleChange("time", e.target.value)}
          />
        </div>

        <div>
          <label className="form-check-label mb-2">What kind of breakfast will you be having?*</label>
          <div className="d-flex flex-column gap-2 ms-2 mt-1">
            {breakfastOptions.map(option => (
              <div key={option} className="d-flex flex-column gap-1">
                <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    value={option}
                    checked={formData.breakfastType.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                    style={{ width: "20px", height: "20px", accentColor: "var(--primary)" }}
                  />
                  <span style={{ fontSize: "1rem" }}>{option}</span>
                </label>
                
                {/* Dynamically render text input if 'Other' is checked */}
                {option === "Other" && formData.breakfastType.includes("Other") && (
                  <TextInput
                    className="full-btn mt-1"
                    type="text"
                    placeholder="Specify request (e.g., Gluten free)"
                    value={formData.specialRequest}
                    onChange={(e) => handleChange("specialRequest", e.target.value)}
                    style={{ width: "calc(100% - 28px)", marginLeft: "28px" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="infoBubble red mt-2">
            {errorMessage}
          </div>
        )}

        <RippleButton 
          type="submit" 
          className="metro-list-btn mt-3"
          disabled={status === "submitting"}
        >
          <span className="material-symbols-rounded">restaurant</span>
          <span className="button-text">{status === "submitting" ? "Sending..." : "Check In"}</span>
        </RippleButton>

      </form>
    </InfoBubble>
  );
}
