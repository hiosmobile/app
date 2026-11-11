import React, { useState, useRef } from "react";
import { TextInput, MenuActionBtn, InfoBubble } from "../../../components/HiMaterial";
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
    roomNo: "", firstName: defaultFirstName, lastName: defaultLastName,
    date: "", time: "", breakfastType: [], specialRequest: ""
  });

  const today = new Date().toISOString().split("T")[0];
  const breakfastOptions = ["Continental breakfast", "Cooked breakfast", "Breakfast rolls", "Other"];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value })); setErrorMessage("");
  };

  const handleCheckboxChange = (option) => {
    setFormData(prev => {
      const currentTypes = prev.breakfastType;
      if (currentTypes.includes(option)) return { ...prev, breakfastType: currentTypes.filter(item => item !== option) };
      return { ...prev, breakfastType: [...currentTypes, option] };
    });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.date === today) {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        if (formData.time < currentTime) {
            setErrorMessage("You cannot book a time in the past."); return;
        }
    }
    if (formData.breakfastType.length === 0) {
        setErrorMessage("Please select at least one kind of breakfast."); return;
    }
    if (formData.breakfastType.includes("Other") && !formData.specialRequest.trim()) {
        setErrorMessage("Please specify your special request."); return;
    }

    if (isSubmitting.current) return;
    isSubmitting.current = true; setStatus("submitting"); setErrorMessage("");

    try {
      await addDoc(collection(db, "breakfast_checkin"), {
        roomNumber: formData.roomNo, firstName: formData.firstName, lastName: formData.lastName,
        customerName: currentUser?.displayName || "Guest", email: currentUser?.email || "Unknown",
        date: formData.date, time: formData.time, breakfastType: formData.breakfastType,
        additionalNotes: formData.breakfastType.includes("Other") ? formData.specialRequest : "",
        createdAt: serverTimestamp(), status: "pending"
      });

      setStatus("success"); window.scrollTo({ top: 0, behavior: "smooth" });
      setFormData({
        roomNo: "", firstName: defaultFirstName, lastName: defaultLastName,
        date: "", time: "", breakfastType: [], specialRequest: ""
      });
    } catch (error) {
      setStatus("error"); setErrorMessage("Network error. Please try again.");
    } finally {
      isSubmitting.current = false;
    }
  };

  if (status === "success") {
    return (
      <InfoBubble className="full text-center m-0 p-4">
        <span className="material-symbols-rounded imageIcon mb-2" style={{ color: "var(--primary)" }}>check_circle</span>
        <h3 className="card-title text-center mb-2">Check-in complete!</h3>
        <p className="subtitle mb-3">Enjoy your breakfast at The Highland Cafe.</p>
        <MenuActionBtn icon="add_circle" text="New Check-in" className="full m-0 mt-3" onClick={() => setStatus("idle")} />
      </InfoBubble>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="settings-group m-0 p-0 text-start">

      <div className="mb-4">
        <TextInput className="joinTop" type="text" placeholder="Room Number *" required value={formData.roomNo} onChange={(e) => handleChange("roomNo", e.target.value)} />
        <TextInput className="joinMiddle" type="text" placeholder="First Name *" required value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
        <TextInput className="joinMiddle" type="text" placeholder="Last Name *" required value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
        <TextInput className="joinMiddle" type="text" placeholder="Date *" onFocus={(e) => e.target.type = "date"} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} required min={today} value={formData.date} onChange={(e) => handleChange("date", e.target.value)} />
        <TextInput className="joinBottom" type="text" placeholder="Time *" onFocus={(e) => e.target.type = "time"} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} required value={formData.time} onChange={(e) => handleChange("time", e.target.value)} />
      </div>

      <InfoBubble className="full m-0 mb-4 p-3 border-0">
        <label className="form-check-label mb-3 fw-bold">Breakfast Type *</label>
        <div className="d-flex flex-column gap-3 ms-1">
          {breakfastOptions.map(option => (
            <div key={option} className="d-flex flex-column gap-1">
              <label className="d-flex align-items-center gap-2 m-0" style={{ cursor: "pointer" }}>
                <input type="checkbox" value={option} checked={formData.breakfastType.includes(option)} onChange={() => handleCheckboxChange(option)} style={{ width: "22px", height: "22px", accentColor: "var(--primary)" }} />
                <span style={{ fontSize: "1rem" }}>{option}</span>
              </label>
              {option === "Other" && formData.breakfastType.includes("Other") && (
                <TextInput className="full mt-2" type="text" placeholder="Specify request..." required value={formData.specialRequest} onChange={(e) => handleChange("specialRequest", e.target.value)} style={{ width: "calc(100% - 30px)", marginLeft: "30px" }} />
              )}
            </div>
          ))}
        </div>
      </InfoBubble>

      {errorMessage && <div className="infoBubble red mt-2 mb-3">{errorMessage}</div>}

      <MenuActionBtn type="submit" className="full m-0" icon="free_breakfast" text={status === "submitting" ? "Sending..." : "Check In"} disabled={status === "submitting"} />
    </form>
  );
}
