import React, { useState, useRef } from "react";
import { TextInput, Dropdown, RippleButton, InfoBubble, Card } from "../../../components/HiMaterial";
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
    branch: "Aberdeen",
    orderName: currentUser?.displayName || "", 
    tableNumber: "",
    menu: "Breakfast",
    foodItems: "",
    drinkItems: "",
    hasAllergens: "No",
    allergenDetails: "",
    notes: "",
  });

  // Synchronized with BookTable locations
  const locations = [
    "Aberdeen", "Manchester", "Edinburgh", "Glasgow", "Southampton",
    "Northampton", "Lancaster", "Inverness", "Mojácar", "Pyongyang",
    "Las Vegas", "Los Angeles", "Phoenix", "New York"
  ].map(loc => ({ label: loc, value: loc }));

  const menus = [
    "Breakfast", "Lunch", "Dinner", "Eat Economy - Lunch/Dinner",
    "Desserts", "Children's", "Specials", "Gourmet"
  ].map(m => ({ label: m, value: m }));

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage("");
  };

  const handleNext = (e) => {
    e.preventDefault(); // Prevent accidental form submission on step navigation
    if (step === 1) {
      if (!formData.orderName.trim() || !formData.tableNumber) {
        setErrorMessage("Please provide a name and table number.");
        return;
      }
      setErrorMessage("");
      setStep(2);
    } else if (step === 2) {
      if (!formData.foodItems.trim() && !formData.drinkItems.trim()) {
        setErrorMessage("Please order at least one food or drink item.");
        return;
      }
      setErrorMessage("");
      setStep(3);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting.current) return;
    
    if (formData.hasAllergens === "Yes" && !formData.allergenDetails.trim()) {
      setErrorMessage("Please specify your allergies so our kitchen can prepare your food safely.");
      return;
    }

    isSubmitting.current = true;
    setStatus("submitting");
    setErrorMessage("");

    try {
      await addDoc(collection(db, "restaurant_orders"), {
        email: currentUser?.email || "Unknown Guest",
        restaurant: formData.branch,
        customerName: formData.orderName,
        tableNumber: formData.tableNumber,
        menu: formData.menu,
        foodItems: formData.foodItems || "None",
        drinkItems: formData.drinkItems || "None",
        allergens: formData.hasAllergens === "Yes" ? formData.allergenDetails : "None",
        additionalNotes: formData.notes,
        createdAt: serverTimestamp(),
        status: "pending"
      });

      setStatus("success");
      setStep(1);
      setFormData({
        branch: "Aberdeen", orderName: currentUser?.displayName || "", tableNumber: "",
        menu: "Breakfast", foodItems: "", drinkItems: "", hasAllergens: "No", allergenDetails: "", notes: ""
      });
    } catch (err) {
      console.error("Firebase Error: ", err);
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    } finally {
      isSubmitting.current = false;
      if (status !== "success") setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <Card className="text-center joinTop" bodyClass="p-4">
        <span className="material-symbols-rounded imageIcon mb-2" style={{ color: "var(--primary)" }}>room_service</span>
        <h3 className="card-title text-center mb-2">Order received!</h3>
        <p className="subtitle mb-3">Your food is being prepared. We will bring it to Table {formData.tableNumber} shortly.</p>
        <RippleButton className="metro-list-btn" onClick={() => setStatus("idle")}>
          <span className="material-symbols-rounded">restaurant</span>
          <span className="button-text">Place another order</span>
        </RippleButton>
      </Card>
    );
  }

  return (
    <InfoBubble className="full text-start">
      <div className="mb-3 border-bottom pb-2">
        <h5 className="mb-0 fw-bold">Step {step} of 3</h5>
      </div>

      <form onSubmit={step === 3 ? handleSubmit : handleNext} className="settings-group g-3">
        {step === 1 && (
          <>
            <div>
              <label className="form-check-label mb-1">Branch</label>
              <Dropdown className="full-btn" options={locations} value={formData.branch} onChange={(val) => handleChange("branch", val)} />
            </div>
            <div>
              <label className="form-check-label mb-1">Name for order *</label>
              <TextInput className="full-btn" type="text" required placeholder="e.g. Aaron" value={formData.orderName} onChange={(e) => handleChange("orderName", e.target.value)} />
            </div>
            <div>
              <label className="form-check-label mb-1">Table Number *</label>
              <TextInput className="full-btn" type="number" required min="1" placeholder="e.g. 12" value={formData.tableNumber} onChange={(e) => handleChange("tableNumber", e.target.value)} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="form-check-label mb-1">Menu</label>
              <Dropdown className="full-btn" options={menus} value={formData.menu} onChange={(val) => handleChange("menu", val)} />
            </div>
            <div>
              <label className="form-check-label mb-1">Food Order</label>
              <TextInput className="full-btn" type="text" placeholder="Leave blank if just ordering drinks" value={formData.foodItems} onChange={(e) => handleChange("foodItems", e.target.value)} />
            </div>
            <div>
              <label className="form-check-label mb-1">Drink Order</label>
              <TextInput className="full-btn" type="text" placeholder="Leave blank if just ordering food" value={formData.drinkItems} onChange={(e) => handleChange("drinkItems", e.target.value)} />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <label className="form-check-label mb-1">Does anyone have allergies?</label>
              <Dropdown className="full-btn" options={[{ label: "No", value: "No" }, { label: "Yes", value: "Yes" }]} value={formData.hasAllergens} onChange={(val) => handleChange("hasAllergens", val)} />
            </div>
            {formData.hasAllergens === "Yes" && (
              <div className="p-2 mt-1 rounded" style={{ backgroundColor: "color-mix(in srgb, var(--errorContainer) 40%, transparent)", border: "1px solid var(--errorContainer)" }}>
                <label className="form-check-label mb-1 fw-bold text-danger">Please specify allergens *</label>
                <TextInput className="full-btn" type="text" placeholder="e.g. Nuts, Dairy, Gluten" value={formData.allergenDetails} onChange={(e) => handleChange("allergenDetails", e.target.value)} />
              </div>
            )}
            <div className="mt-2">
              <label className="form-check-label mb-1">Additional Notes</label>
              <TextInput className="full-btn" type="text" placeholder="e.g. Extra napkins" value={formData.notes} onChange={(e) => handleChange("notes", e.target.value)} />
            </div>
          </>
        )}

        {errorMessage && <div className="infoBubble red mt-2">{errorMessage}</div>}

        <div className="mt-3">
          {step > 1 && (
            <RippleButton type="button" className="metro-list-btn mb-2" onClick={handleBack} style={{ backgroundColor: "var(--secondaryContainer)", color: "var(--onSecondaryContainer)" }}>
              <span className="material-symbols-rounded">arrow_back</span><span className="button-text">Back</span>
            </RippleButton>
          )}
          {step < 3 ? (
            <RippleButton type="button" className="metro-list-btn" onClick={handleNext}>
              <span className="button-text">Next step</span><span className="material-symbols-rounded ms-auto">arrow_forward</span>
            </RippleButton>
          ) : (
            <RippleButton type="submit" className="metro-list-btn" disabled={status === "submitting"}>
              <span className="material-symbols-rounded">room_service</span>
              <span className="button-text">{status === "submitting" ? "Sending..." : "Send Order"}</span>
            </RippleButton>
          )}
        </div>
      </form>
    </InfoBubble>
  );
}