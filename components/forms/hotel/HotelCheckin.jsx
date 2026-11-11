import React, { useState, useRef } from "react";
import { TextInput, Dropdown, MenuActionBtn, InfoBubble } from "../../../components/HiMaterial";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../src/firebase";
import { useAuth } from "../../../src/AuthContext";

export default function HotelCheckin() {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const isSubmitting = useRef(false);

  const [currentPage, setCurrentPage] = useState(1);

  const defaultLastName = currentUser?.displayName?.split(" ").slice(1).join(" ") || "";

  const [formData, setFormData] = useState({
    location: "", bookingRef: "", lastName: defaultLastName,
    arrivalDate: "", arrivalTime: "", vehicleReg: "", specialRequests: ""
  });

  const today = new Date().toISOString().split("T")[0];

  const locationOptions = [{ label: "Select weB&B Location *", value: "" }, ...[
    "Aberdeen", "Manchester", "Edinburgh", "Glasgow", "Southampton",
    "Northampton", "Lancaster", "Inverness", "Mojácar", "Pyongyang",
    "Las Vegas", "Los Angeles", "Phoenix", "New York"
  ].map(loc => ({ label: loc, value: loc }))];

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
      if (!formData.location || !formData.bookingRef || !formData.lastName) {
        setErrorMessage("Please fill in all required fields."); return;
      }
      setErrorMessage(""); setCurrentPage(2);
      window.scrollTo({ top: 0, behavior: "smooth" });

    } else if (currentPage === 2) {
      if (!formData.arrivalDate || !formData.arrivalTime) {
        setErrorMessage("Please provide your estimated arrival date and time."); return;
      }

      if (isSubmitting.current) return;
      isSubmitting.current = true; setStatus("submitting"); setErrorMessage("");

      // Bundle extra info into additionalNotes so it shows up perfectly on the Admin Dashboard
      let compiledNotes = `Booking Ref: ${formData.bookingRef}`;
      if (formData.vehicleReg) compiledNotes += ` | Vehicle: ${formData.vehicleReg}`;
      if (formData.specialRequests) compiledNotes += ` | Notes: ${formData.specialRequests}`;

      try {
        await addDoc(collection(db, "hotel_checkin"), {
          location: formData.location,
          lastName: formData.lastName,
          email: currentUser?.email || "Unknown",
          date: formData.arrivalDate,
          time: formData.arrivalTime,
          additionalNotes: compiledNotes,
          createdAt: serverTimestamp(),
          status: "pending"
        });

        setStatus("success"); window.scrollTo({ top: 0, behavior: "smooth" });
        setFormData({
          location: "", bookingRef: "", lastName: defaultLastName,
          arrivalDate: "", arrivalTime: "", vehicleReg: "", specialRequests: ""
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
        <span className="material-symbols-rounded imageIcon mb-2" style={{ color: "var(--primary)" }}>how_to_reg</span>
        <h3 className="card-title text-center mb-2">Check-in Sent!</h3>
        <p className="subtitle mb-3">We have received your details and look forward to welcoming you.</p>
        <MenuActionBtn icon="add_circle" text="New Check-in" className="full m-0 mt-3" onClick={() => setStatus("idle")} />
      </InfoBubble>
    );
  }

  return (
    <form onSubmit={handleNextOrSubmit} className="settings-group m-0 p-0 text-start">
      <span className="opacity-75 fw-bold ms-1" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>Step {currentPage} of 2</span>
      <h4 className="blue-h3 mb-3 ms-1" style={{ fontSize: "1.3rem" }}>
        {currentPage === 1 ? "Booking Details" : "Arrival & Preferences"}
      </h4>

      {/* --- PAGE 1 --- */}
      <div style={{ display: currentPage === 1 ? "block" : "none" }} className="metro-anim-list-item delay-1 mb-4">
        <Dropdown className="joinTop" options={locationOptions} value={formData.location} onChange={(val) => handleChange("location", val)} />
        <TextInput className="joinMiddle" type="text" placeholder="Booking Reference *" required={currentPage === 1} value={formData.bookingRef} onChange={(e) => handleChange("bookingRef", e.target.value)} />
        <TextInput className="joinBottom" type="text" placeholder="Last Name on Booking *" required={currentPage === 1} value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
      </div>

      {/* --- PAGE 2 --- */}
      <div style={{ display: currentPage === 2 ? "block" : "none" }} className="metro-anim-list-item delay-1 mb-4">
        <TextInput className="joinTop" type="text" placeholder="Arrival Date *" onFocus={(e) => e.target.type = "date"} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} required={currentPage === 2} min={today} value={formData.arrivalDate} onChange={(e) => handleChange("arrivalDate", e.target.value)} />
        <TextInput className="joinMiddle" type="text" placeholder="Est. Arrival Time *" onFocus={(e) => e.target.type = "time"} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} required={currentPage === 2} value={formData.arrivalTime} onChange={(e) => handleChange("arrivalTime", e.target.value)} />
        <TextInput className="joinMiddle" type="text" placeholder="Vehicle Registration (Optional)" value={formData.vehicleReg} onChange={(e) => handleChange("vehicleReg", e.target.value)} />
        <TextInput className="joinBottom" type="text" placeholder="Special Requests (Optional)" value={formData.specialRequests} onChange={(e) => handleChange("specialRequests", e.target.value)} />
      </div>

      {errorMessage && <div className="infoBubble red mt-2 mb-3">{errorMessage}</div>}

      <div className="d-flex flex-column mt-2">
        <MenuActionBtn
          type="submit" className={currentPage > 1 ? "joinTop m-0" : "full m-0"} icon={currentPage === 2 ? "done_all" : "arrow_forward"}
          text={currentPage === 2 ? (status === "submitting" ? "Sending..." : "Complete Check-in") : "Next"} disabled={status === "submitting"}
        />
        {currentPage > 1 && (
          <MenuActionBtn type="button" className="joinBottom m-0" icon="arrow_back" text="Back" onClick={handleBack} />
        )}
      </div>
    </form>
  );
}
