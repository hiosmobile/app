import React, { useState, useRef } from "react";
import { TextInput, Dropdown, MenuActionBtn, InfoBubble } from "../../../components/HiMaterial";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../src/firebase";
import { useAuth } from "../../../src/AuthContext";

export default function HotelCheckout() {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const isSubmitting = useRef(false);

  const [currentPage, setCurrentPage] = useState(1);

  const defaultLastName = currentUser?.displayName?.split(" ").slice(1).join(" ") || "";

  const [formData, setFormData] = useState({
    location: "", roomNumber: "", lastName: defaultLastName,
    departureTime: "", experience: "", comments: ""
  });

  const locationOptions = [{ label: "Select weB&B Location *", value: "" }, ...[
    "Aberdeen", "Manchester", "Edinburgh", "Glasgow", "Southampton",
    "Northampton", "Lancaster", "Inverness", "Mojácar", "Pyongyang",
    "Las Vegas", "Los Angeles", "Phoenix", "New York"
  ].map(loc => ({ label: loc, value: loc }))];

  const experienceOptions = [
    { label: "How was your stay? *", value: "" },
    { label: "Excellent", value: "Excellent" },
    { label: "Good", value: "Good" },
    { label: "Okay", value: "Okay" },
    { label: "Poor", value: "Poor" }
  ];

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
      if (!formData.location || !formData.roomNumber || !formData.lastName) {
        setErrorMessage("Please fill in all required fields."); return;
      }
      setErrorMessage(""); setCurrentPage(2);
      window.scrollTo({ top: 0, behavior: "smooth" });

    } else if (currentPage === 2) {
      if (!formData.departureTime || !formData.experience) {
        setErrorMessage("Please complete your departure and feedback details."); return;
      }

      if (isSubmitting.current) return;
      isSubmitting.current = true; setStatus("submitting"); setErrorMessage("");

      const today = new Date().toISOString().split("T")[0];

      let compiledNotes = `Rating: ${formData.experience}`;
      if (formData.comments) compiledNotes += ` | Feedback: ${formData.comments}`;

      try {
        await addDoc(collection(db, "hotel_checkout"), {
          location: formData.location,
          roomNumber: formData.roomNumber,
          lastName: formData.lastName,
          email: currentUser?.email || "Unknown",
          date: today,
          time: formData.departureTime,
          additionalNotes: compiledNotes,
          createdAt: serverTimestamp(),
          status: "pending"
        });

        setStatus("success"); window.scrollTo({ top: 0, behavior: "smooth" });
        setFormData({
          location: "", roomNumber: "", lastName: defaultLastName,
          departureTime: "", experience: "", comments: ""
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
        <span className="material-symbols-rounded imageIcon mb-2" style={{ color: "var(--primary)" }}>waving_hand</span>
        <h3 className="card-title text-center mb-2">Safe Travels!</h3>
        <p className="subtitle mb-3">Your check-out request has been processed. Thank you for staying with us.</p>
        <MenuActionBtn icon="add_circle" text="New Check-out" className="full m-0 mt-3" onClick={() => setStatus("idle")} />
      </InfoBubble>
    );
  }

  return (
    <form onSubmit={handleNextOrSubmit} className="settings-group m-0 p-0 text-start">
      <span className="opacity-75 fw-bold ms-1" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>Step {currentPage} of 2</span>
      <h4 className="blue-h3 mb-3 ms-1" style={{ fontSize: "1.3rem" }}>
        {currentPage === 1 ? "Stay Details" : "Departure & Feedback"}
      </h4>

      {/* --- PAGE 1 --- */}
      <div style={{ display: currentPage === 1 ? "block" : "none" }} className="metro-anim-list-item delay-1 mb-4">
        <Dropdown className="joinTop" options={locationOptions} value={formData.location} onChange={(val) => handleChange("location", val)} />
        <TextInput className="joinMiddle" type="text" placeholder="Room Number *" required={currentPage === 1} value={formData.roomNumber} onChange={(e) => handleChange("roomNumber", e.target.value)} />
        <TextInput className="joinBottom" type="text" placeholder="Last Name on Booking *" required={currentPage === 1} value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
      </div>

      {/* --- PAGE 2 --- */}
      <div style={{ display: currentPage === 2 ? "block" : "none" }} className="metro-anim-list-item delay-1 mb-4">
        <TextInput className="joinTop" type="text" placeholder="Departure Time *" onFocus={(e) => e.target.type = "time"} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} required={currentPage === 2} value={formData.departureTime} onChange={(e) => handleChange("departureTime", e.target.value)} />
        <Dropdown className="joinMiddle" options={experienceOptions} value={formData.experience} onChange={(val) => handleChange("experience", val)} />
        <TextInput className="joinBottom" type="text" placeholder="Additional Comments (Optional)" value={formData.comments} onChange={(e) => handleChange("comments", e.target.value)} />
      </div>

      {errorMessage && <div className="infoBubble red mt-2 mb-3">{errorMessage}</div>}

      <div className="d-flex flex-column mt-2">
        <MenuActionBtn
          type="submit" className={currentPage > 1 ? "joinTop m-0" : "full m-0"} icon={currentPage === 2 ? "logout" : "arrow_forward"}
          text={currentPage === 2 ? (status === "submitting" ? "Sending..." : "Complete Check-out") : "Next"} disabled={status === "submitting"}
        />
        {currentPage > 1 && (
          <MenuActionBtn type="button" className="joinBottom m-0" icon="arrow_back" text="Back" onClick={handleBack} />
        )}
      </div>
    </form>
  );
}
