import React, { useState, useRef } from "react";
import { Card, TextInput, Dropdown, RippleButton, InfoBubble } from "../../../components/HiMaterial";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../src/firebase"; 
import { useAuth } from "../../../src/AuthContext"; 

export default function BookTable() {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState("idle"); 
  const [errorMessage, setErrorMessage] = useState("");
  const isSubmitting = useRef(false);
  
  const [formData, setFormData] = useState({
    restaurant: "Aberdeen",
    dateBooked: "",
    timeBooked: "",
    people: 1,
  });

  const locations = [
    "Aberdeen", "Manchester", "Edinburgh", "Glasgow", "Southampton",
    "Northampton", "Lancaster", "Inverness", "Mojácar", "Pyongyang",
    "Las Vegas", "Los Angeles", "Phoenix", "New York"
  ].map(loc => ({ label: loc, value: loc }));

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.dateBooked === today) {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (formData.timeBooked < currentTime) {
        setErrorMessage("You cannot book a time in the past.");
        return;
      }
    }

    if (isSubmitting.current) return;
    
    isSubmitting.current = true;
    setStatus("submitting");
    setErrorMessage("");

    try {
      await addDoc(collection(db, "restaurant_bookings"), {
        restaurant: formData.restaurant,
        // Automatically inject user details from Firebase Auth
        customerName: currentUser?.displayName || "Guest",
        email: currentUser?.email || "Unknown",
        dateBooked: formData.dateBooked,
        timeBooked: formData.timeBooked,
        peopleCount: Number(formData.people),
        createdAt: serverTimestamp(), 
        status: "pending" 
      });

      setStatus("success");
      setFormData({ restaurant: "Aberdeen", dateBooked: "", timeBooked: "", people: 1 });
      
    } catch (err) {
      console.error("Firebase Error: ", err);
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
        <span className="material-symbols-rounded imageIcon mb-2" style={{ color: "var(--primary)" }}>check_circle</span>
        <h3 className="card-title text-center mb-2">booking sent!</h3>
        <p className="subtitle mb-3">We will review your request and send a confirmation email shortly.</p>
        <RippleButton className="metro-list-btn" onClick={() => setStatus("idle")}>
          <span className="button-text">Book another table</span>
        </RippleButton>
      </Card>
    );
  }

  return (
    <InfoBubble className="full text-start">
      <form onSubmit={handleSubmit} className="settings-group g-3">
        
        <div>
          <label className="form-check-label mb-1">Restaurant location*</label>
          <Dropdown className="full-btn" options={locations} value={formData.restaurant} onChange={(val) => handleChange("restaurant", val)} />
        </div>

        <div>
            <label className="form-check-label mb-1">Date*</label>
            <TextInput className="full-btn" type="date" required min={today} value={formData.dateBooked} onChange={(e) => handleChange("dateBooked", e.target.value)} />
        </div>

        <div>
            <label className="form-check-label mb-1">Time*</label>
            <TextInput className="full-btn" type="time" required value={formData.timeBooked} onChange={(e) => handleChange("timeBooked", e.target.value)} />
        </div>

        <div>
          <label className="form-check-label mb-1">How many people? (8 max.)*</label>
          <TextInput className="full-btn" type="number" min="1" max="8" required value={formData.people} onChange={(e) => handleChange("people", e.target.value)} />
        </div>

        {errorMessage && <div className="infoBubble red mt-2">{errorMessage}</div>}

        <RippleButton type="submit" className="metro-list-btn mt-3" disabled={status === "submitting"}>
          <span className="material-symbols-rounded">how_to_reg</span>
          <span className="button-text">{status === "submitting" ? "Sending..." : "Submit Booking"}</span>
        </RippleButton>

      </form>
    </InfoBubble>
  );
}