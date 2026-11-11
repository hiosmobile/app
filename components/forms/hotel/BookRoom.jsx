import React, { useState, useRef } from "react";
import { TextInput, Dropdown, MenuActionBtn, InfoBubble, Card } from "../../../components/HiMaterial";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../src/firebase";
import { useAuth } from "../../../src/AuthContext";

export default function BookRoom() {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const isSubmitting = useRef(false);

  const [currentPage, setCurrentPage] = useState(1);

  const defaultFirstName = currentUser?.displayName?.split(" ")[0] || "";
  const defaultLastName = currentUser?.displayName?.split(" ").slice(1).join(" ") || "";

  const [formData, setFormData] = useState({
    location: "", checkIn: "", checkOut: "", adults: "", children: "",
    roomType: "", accessible: "", firstName: defaultFirstName,
    lastName: defaultLastName, email: currentUser?.email || "", phone: "",
    anythingElse: "", tellUs: ""
  });

  const today = new Date().toISOString().split("T")[0];

  // Injected Placeholder Options
  const locationOptions = [{ label: "Select weB&B Location *", value: "" }, ...[
    "Aberdeen", "Manchester", "Edinburgh", "Glasgow", "Southampton",
    "Northampton", "Lancaster", "Inverness", "Mojácar", "Pyongyang",
    "Las Vegas", "Los Angeles", "Phoenix", "New York"
  ].map(loc => ({ label: loc, value: loc }))];

  const roomOptions = [{ label: "Select Room Type *", value: "" }, ...["Single En-suite", "Double En-suite", "Twin En-suite", "Family En-suite"].map(type => ({ label: type, value: type }))];
  const accessibleOptions = [{ label: "Require Accessible Room? *", value: "" }, { label: "No", value: "No" }, { label: "Yes", value: "Yes" }];
  const requestsOptions = [{ label: "Any special requests? *", value: "" }, { label: "No", value: "No" }, { label: "Yes", value: "Yes" }];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage("");
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setErrorMessage(""); setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextOrSubmit = async (e) => {
    e.preventDefault();

    if (currentPage === 1) {
      if (!formData.location || !formData.checkIn || !formData.checkOut || !formData.adults || !formData.children) {
        setErrorMessage("Please fill in all required fields."); return;
      }
      if (formData.checkOut <= formData.checkIn) {
        setErrorMessage("Check-out date must be after check-in date."); return;
      }
      setErrorMessage(""); setCurrentPage(2);
      window.scrollTo({ top: 0, behavior: "smooth" });

    } else if (currentPage === 2) {
      if (!formData.roomType || !formData.accessible) {
        setErrorMessage("Please complete your room selection."); return;
      }
      setErrorMessage(""); setCurrentPage(3);
      window.scrollTo({ top: 0, behavior: "smooth" });

    } else if (currentPage === 3) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.anythingElse) {
        setErrorMessage("Please fill in all required contact details."); return;
      }
      if (formData.anythingElse === "Yes" && !formData.tellUs.trim()) {
        setErrorMessage("Please specify your special request."); return;
      }

      if (isSubmitting.current) return;
      isSubmitting.current = true; setStatus("submitting"); setErrorMessage("");

      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const calculatedNights = Math.round((end - start) / (1000 * 60 * 60 * 24));

      try {
        await addDoc(collection(db, "hotel_bookings"), {
          location: formData.location, customerName: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName, lastName: formData.lastName, email: formData.email,
          phone: formData.phone, startDate: formData.checkIn, endDate: formData.checkOut,
          nights: calculatedNights, adults: Number(formData.adults), children: Number(formData.children),
          roomType: formData.roomType, accessibleRoom: formData.accessible,
          additionalNotes: formData.anythingElse === "Yes" ? formData.tellUs : "",
          createdAt: serverTimestamp(), status: "pending"
        });

        setStatus("success"); window.scrollTo({ top: 0, behavior: "smooth" });
        setFormData({
          location: "", checkIn: "", checkOut: "", adults: "", children: "", roomType: "", accessible: "",
          firstName: defaultFirstName, lastName: defaultLastName, email: currentUser?.email || "", phone: "", anythingElse: "", tellUs: ""
        });
        setCurrentPage(1);
      } catch (error) {
        setStatus("error"); setErrorMessage("Network error. Please try again.");
      } finally {
        isSubmitting.current = false;
      }
    }
  };

  if (status === "success") {
    return (
      <InfoBubble className="full text-center m-0 p-4">
        <span className="material-symbols-rounded imageIcon mb-2" style={{ color: "var(--primary)" }}>check_circle</span>
        <h3 className="card-title text-center mb-2">booking received!</h3>
        <p className="subtitle mb-3">We look forward to hosting your stay at weB&B {formData.location}.</p>
        <MenuActionBtn icon="add_circle" text="New Booking" className="full m-0 mt-3" onClick={() => setStatus("idle")} />
      </InfoBubble>
    );
  }

  return (
    <form onSubmit={handleNextOrSubmit} className="settings-group m-0 p-0 text-start">
      <span className="opacity-75 fw-bold ms-1" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>Step {currentPage} of 3</span>
      <h4 className="blue-h3 mb-3 ms-1" style={{ fontSize: "1.3rem" }}>
        {currentPage === 1 ? "Your Stay" : (currentPage === 2 ? "Room Selection" : "Guest Details")}
      </h4>

      {/* --- PAGE 1 --- */}
      <div style={{ display: currentPage === 1 ? "block" : "none" }} className="metro-anim-list-item delay-1 mb-4">
        <Dropdown className="joinTop" options={locationOptions} value={formData.location} onChange={(val) => handleChange("location", val)} />
        <TextInput className="joinMiddle" type="text" placeholder="Check-in Date *" onFocus={(e) => e.target.type = "date"} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} required={currentPage === 1} min={today} value={formData.checkIn} onChange={(e) => handleChange("checkIn", e.target.value)} />
        <TextInput className="joinMiddle" type="text" placeholder="Check-out Date *" onFocus={(e) => e.target.type = "date"} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} required={currentPage === 1} min={formData.checkIn || today} value={formData.checkOut} onChange={(e) => handleChange("checkOut", e.target.value)} />
        <TextInput className="joinMiddle" type="number" placeholder="Adults *" min="1" max="4" required={currentPage === 1} value={formData.adults} onChange={(e) => handleChange("adults", e.target.value)} />
        <TextInput className="joinBottom" type="number" placeholder="Children *" min="0" max="4" required={currentPage === 1} value={formData.children} onChange={(e) => handleChange("children", e.target.value)} />
      </div>

      {/* --- PAGE 2 --- */}
      <div style={{ display: currentPage === 2 ? "block" : "none" }} className="metro-anim-list-item delay-1 mb-4">
        <Dropdown className="joinTop" options={roomOptions} value={formData.roomType} onChange={(val) => handleChange("roomType", val)} />
        <Dropdown className="joinBottom" options={accessibleOptions} value={formData.accessible} onChange={(val) => handleChange("accessible", val)} />
      </div>

      {/* --- PAGE 3 --- */}
      <div style={{ display: currentPage === 3 ? "block" : "none" }} className="metro-anim-list-item delay-1 mb-4">
        <TextInput className="joinTop" type="text" placeholder="First Name *" required={currentPage === 3} value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
        <TextInput className="joinMiddle" type="text" placeholder="Last Name *" required={currentPage === 3} value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
        <TextInput className="joinMiddle" type="email" placeholder="Email Address *" required={currentPage === 3} value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
        <TextInput className="joinMiddle" type="tel" placeholder="Contact Number *" required={currentPage === 3} value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />

        {/* Dynamic Joining based on Special Requests */}
        <Dropdown className={formData.anythingElse === "Yes" ? "joinMiddle" : "joinBottom"} options={requestsOptions} value={formData.anythingElse} onChange={(val) => handleChange("anythingElse", val)} />
        {formData.anythingElse === "Yes" && (
          <TextInput className="joinBottom" type="text" placeholder="Specify requests..." required={currentPage === 3} value={formData.tellUs} onChange={(e) => handleChange("tellUs", e.target.value)} />
        )}
      </div>

      {errorMessage && <div className="infoBubble red mt-2 mb-3">{errorMessage}</div>}

      <div className="d-flex flex-column mt-2">
        <MenuActionBtn
          type="submit" className={currentPage > 1 ? "joinTop m-0" : "full m-0"} icon={currentPage === 3 ? "bed" : "arrow_forward"}
          text={currentPage === 3 ? (status === "submitting" ? "Sending..." : "Confirm Booking") : "Next"} disabled={status === "submitting"}
        />
        {currentPage > 1 && (
          <MenuActionBtn type="button" className="joinBottom m-0" icon="arrow_back" text="Back" onClick={handleBack} />
        )}
      </div>
    </form>
  );
}
