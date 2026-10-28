import React, { useState } from "react";
import { Card, TextInput, Dropdown, RippleButton, InfoBubble } from "../../HiMaterial";
import { useForminit } from "../../hooks/useForminit"; 

export default function BookTable() {
  const { status, errorMessage, setErrorMessage, submit, reset } = useForminit("dw3w55hw8kd");
  
  const [formData, setFormData] = useState({
    restaurant: "Aberdeen",
    lastName: "",
    email: "",
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
    
    const nameRegex = /^[A-Za-z\s\-']+$/;
    if (formData.lastName.length < 2 || !nameRegex.test(formData.lastName)) {
      setErrorMessage("Please enter a valid real name.");
      return;
    }

    if (formData.dateBooked === today) {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (formData.timeBooked < currentTime) {
        setErrorMessage("You cannot book a time in the past.");
        return;
      }
    }

    const form = e.target;
    const fd = new FormData(form);

    const success = await submit(fd);
    if (success) {
      setFormData({ restaurant: "Aberdeen", lastName: "", email: "", dateBooked: "", timeBooked: "", people: 1 });
    }
  };

  if (status === "success") {
    return (
      <InfoBubble>
        <span className="material-symbols-rounded imageIcon mb-2" style={{ color: "var(--primary)" }}>
          check_circle
        </span>
        
        <h3 className="card-title text-center mb-2">booking sent!</h3>
        <p className="subtitle mb-3">We will review your request and send a confirmation email shortly.</p>
        
        <RippleButton className="form-button" onClick={reset}>
          Book another table
        </RippleButton>
      </InfoBubble>
    );
  }

  return (
    <InfoBubble className="full text-start" title="book your table">
      {/* Utilizing settings-group and g-3 for native flexbox column gap spacing */}
      <form onSubmit={handleSubmit} className="settings-group g-3">
        
        <div>
          {/* Utilizing your native form-check-label for consistent label weights */}
          <label className="form-check-label mb-1">Restaurant Location *</label>
          <Dropdown
            className="full-btn"
            name="fi-select-restaurant"
            options={locations}
            value={formData.restaurant}
            onChange={(val) => handleChange("restaurant", val)}
          />
        </div>

        <div>
          <label className="form-check-label mb-1">Last Name *</label>
          <TextInput
            className="full-btn"
            name="fi-sender-lastName"
            type="text"
            required
            placeholder="e.g. Smith"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </div>

        <div>
          <label className="form-check-label mb-1">Email Address *</label>
          <TextInput
            className="full-btn"
            name="fi-sender-email"
            type="email"
            required
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div className="d-flex gap-1">
          <div className="flex-grow-1">
            <label className="form-check-label mb-1">Date *</label>
            <TextInput
              className="joinLeft"
              name="fi-date-dateBooked"
              type="date"
              required
              min={today}
              value={formData.dateBooked}
              onChange={(e) => handleChange("dateBooked", e.target.value)}
            />
          </div>
          <div className="flex-grow-1">
            <label className="form-check-label mb-1">Time *</label>
            <TextInput
              className="joinRight"
              name="fi-text-timeBooked"
              type="time"
              required
              value={formData.timeBooked}
              onChange={(e) => handleChange("timeBooked", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="form-check-label mb-1">How many people? (8 Max) *</label>
          <TextInput
            className="full-btn"
            name="fi-number-peopleCount"
            type="number"
            min="1"
            max="8"
            required
            value={formData.people}
            onChange={(e) => handleChange("people", e.target.value)}
          />
        </div>

        {status === "error" && (
          /* Utilizing your native infoBubble and red classes for standard error styling */
          <div className="infoBubble red mt-2">
            {errorMessage}
          </div>
        )}

        <RippleButton 
          type="submit" 
          className="form-button mt-2"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending..." : "Submit Booking"}
        </RippleButton>

      </form>
    </InfoBubble>
  );
}