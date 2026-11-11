import React, { useState, useRef } from "react";
import { TextInput, Dropdown, MenuActionBtn, InfoBubble } from "../../../components/HiMaterial";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../src/firebase";
import { useAuth } from "../../../src/AuthContext";

export default function OrderFood() {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);
  const isSubmitting = useRef(false);

  const [formData, setFormData] = useState({
    branch: "", orderName: currentUser?.displayName || "", tableNumber: "",
    menu: "", foodItems: "", drinkItems: "", hasAllergens: "", allergenDetails: "", notes: "",
  });

  const locationOptions = [{ label: "Select Branch *", value: "" }, ...[
    "Aberdeen", "Manchester", "Edinburgh", "Glasgow", "Southampton", "Northampton",
    "Lancaster", "Inverness", "Mojácar", "Pyongyang", "Las Vegas", "Los Angeles", "Phoenix", "New York"
  ].map(loc => ({ label: loc, value: loc }))];

  const menuOptions = [{ label: "Select Menu *", value: "" }, ...["Breakfast", "Lunch", "Dinner", "Eat Economy - Lunch/Dinner", "Desserts", "Children's", "Specials", "Gourmet"].map(m => ({ label: m, value: m }))];
  const allergenOptions = [{ label: "Does anyone have allergies? *", value: "" }, { label: "No", value: "No" }, { label: "Yes", value: "Yes" }];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage("");
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.branch || !formData.orderName.trim() || !formData.tableNumber) {
        setErrorMessage("Please fill in all required fields."); return;
      }
      setErrorMessage(""); setStep(2); window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === 2) {
      if (!formData.menu) {
        setErrorMessage("Please select a menu."); return;
      }
      if (!formData.foodItems.trim() && !formData.drinkItems.trim()) {
        setErrorMessage("Please order at least one food or drink item."); return;
      }
      setErrorMessage(""); setStep(3); window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    setErrorMessage(""); setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting.current) return;

    if (!formData.hasAllergens) {
      setErrorMessage("Please select an allergy option."); return;
    }
    if (formData.hasAllergens === "Yes" && !formData.allergenDetails.trim()) {
      setErrorMessage("Please specify your allergies."); return;
    }

    isSubmitting.current = true; setStatus("submitting"); setErrorMessage("");

    try {
      await addDoc(collection(db, "restaurant_orders"), {
        email: currentUser?.email || "Unknown Guest", restaurant: formData.branch,
        customerName: formData.orderName, tableNumber: formData.tableNumber,
        menu: formData.menu, foodItems: formData.foodItems || "None", drinkItems: formData.drinkItems || "None",
        allergens: formData.hasAllergens === "Yes" ? formData.allergenDetails : "None",
        additionalNotes: formData.notes, createdAt: serverTimestamp(), status: "pending"
      });

      setStatus("success"); window.scrollTo({ top: 0, behavior: "smooth" }); setStep(1);
      setFormData({
        branch: "", orderName: currentUser?.displayName || "", tableNumber: "", menu: "",
        foodItems: "", drinkItems: "", hasAllergens: "", allergenDetails: "", notes: ""
      });
    } catch (err) {
      setStatus("error"); setErrorMessage("Network error. Please try again.");
    } finally {
      isSubmitting.current = false;
    }
  };

  if (status === "success") {
    return (
      <InfoBubble className="full text-center m-0 p-4">
        <span className="material-symbols-rounded imageIcon mb-2" style={{ color: "var(--primary)" }}>room_service</span>
        <h3 className="card-title text-center mb-2">Order received!</h3>
        <p className="subtitle mb-3">Your food is being prepared. We will bring it to Table {formData.tableNumber} shortly.</p>
        <MenuActionBtn icon="add_circle" text="New Order" className="full m-0 mt-3" onClick={() => setStatus("idle")} />
      </InfoBubble>
    );
  }

  return (
    <form onSubmit={step === 3 ? handleSubmit : handleNext} className="settings-group m-0 p-0 text-start">
      <span className="opacity-75 fw-bold ms-1" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>Step {step} of 3</span>
      <h4 className="blue-h3 mb-3 ms-1" style={{ fontSize: "1.3rem" }}>
        {step === 1 ? "Location & Table" : (step === 2 ? "Your Order" : "Final Details")}
      </h4>

      {step === 1 && (
        <div className="mb-4 metro-anim-list-item delay-1">
          <Dropdown className="joinTop" options={locationOptions} value={formData.branch} onChange={(val) => handleChange("branch", val)} />
          <TextInput className="joinMiddle" type="text" required placeholder="Name for order *" value={formData.orderName} onChange={(e) => handleChange("orderName", e.target.value)} />
          <TextInput className="joinBottom" type="number" required min="1" placeholder="Table Number *" value={formData.tableNumber} onChange={(e) => handleChange("tableNumber", e.target.value)} />
        </div>
      )}

      {step === 2 && (
        <div className="mb-4 metro-anim-list-item delay-1">
          <Dropdown className="joinTop" options={menuOptions} value={formData.menu} onChange={(val) => handleChange("menu", val)} />
          <TextInput className="joinMiddle" type="text" placeholder="Food Order (Optional)" value={formData.foodItems} onChange={(e) => handleChange("foodItems", e.target.value)} />
          <TextInput className="joinBottom" type="text" placeholder="Drink Order (Optional)" value={formData.drinkItems} onChange={(e) => handleChange("drinkItems", e.target.value)} />
        </div>
      )}

      {step === 3 && (
        <div className="mb-4 metro-anim-list-item delay-1">
          <Dropdown className={formData.hasAllergens === "Yes" ? "joinTop" : "joinTop"} options={allergenOptions} value={formData.hasAllergens} onChange={(val) => handleChange("hasAllergens", val)} />
          {formData.hasAllergens === "Yes" && (
            <TextInput className="joinMiddle red" type="text" placeholder="Specify Allergens *" required={formData.hasAllergens === "Yes"} value={formData.allergenDetails} onChange={(e) => handleChange("allergenDetails", e.target.value)} />
          )}
          <TextInput className="joinBottom" type="text" placeholder="Additional Notes (Optional)" value={formData.notes} onChange={(e) => handleChange("notes", e.target.value)} />
        </div>
      )}

      {errorMessage && <div className="infoBubble red mt-2 mb-3">{errorMessage}</div>}

      <div className="d-flex flex-column mt-2">
        <MenuActionBtn
          type="submit" className={step > 1 ? "joinTop m-0" : "full m-0"} icon={step === 3 ? "room_service" : "arrow_forward"}
          text={step === 3 ? (status === "submitting" ? "Sending..." : "Send Order") : "Next"} disabled={status === "submitting"}
        />
        {step > 1 && (
          <MenuActionBtn type="button" className="joinBottom m-0" icon="arrow_back" text="Back" onClick={handleBack} />
        )}
      </div>
    </form>
  );
}
