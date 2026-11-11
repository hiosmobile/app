import React, { useState, useRef } from "react";
import { TextInput, Dropdown, MenuActionBtn, InfoBubble } from "../../../components/HiMaterial";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../src/firebase";
import { useAuth } from "../../../src/AuthContext";

export default function BaristaOrder() {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);
  const isSubmitting = useRef(false);

  const [formData, setFormData] = useState({
    branch: "", orderName: currentUser?.displayName || "", tableNumber: "",
    hotDrink: "", coldDrink: "", foodItem: "", sizePrefs: "",
    hasAllergens: "", allergenDetails: "", notes: "",
  });

  const locationOptions = [{ label: "Select Barista Location *", value: "" }, ...[
    "Aberdeen", "Manchester", "Edinburgh", "Glasgow", "Southampton", "Northampton",
    "Lancaster", "Inverness", "Mojácar", "Pyongyang", "Las Vegas", "Los Angeles", "Phoenix", "New York"
  ].map(loc => ({ label: loc, value: loc }))];

  // Menu items enriched with sizes and GBP pricing
  const hotDrinkOptions = [
    { label: "Hot Drink (Optional)", value: "" },
    { label: "Espresso (Sml £6.40)", value: "Espresso" },
    { label: "Double Espresso (Sml £13.00)", value: "Double Espresso" },
    { label: "Americano (Med £13.00 / Lrg £18.00)", value: "Americano" },
    { label: "Macchiato (Med £16.00 / Lrg £20.00)", value: "Macchiato" },
    { label: "Cortado (Sml £8.00 / Med £15.00)", value: "Cortado" },
    { label: "Cappuccino (Med £15.00 / Lrg £21.00)", value: "Cappuccino" },
    { label: "Flat White (Med £15.00 / Lrg £21.00)", value: "Flat White" },
    { label: "Latte (Med £10.00 / Lrg £24.00)", value: "Latte" },
    { label: "Mocha (Med £19.00 / Lrg £24.00)", value: "Mocha" },
    { label: "Cafetiere (Lrg £21.00)", value: "Cafetiere" },
    { label: "Filter (Sml £7.00 / Med £14.00 / Lrg £21.00)", value: "Filter" },
    { label: "Turkish (Sml £10.00)", value: "Turkish" },
    { label: "Hot Chocolate (Std £12.00 / Deluxe £18.00)", value: "Hot Chocolate" },
    { label: "Tea (Per pot £7.00)", value: "Tea" }
  ];

  const coldDrinkOptions = [
    { label: "Cold Drink (Optional)", value: "" },
    { label: "Highland Cola - £12.99", value: "Highland Cola" },
    { label: "HiCola Energy - £14.99", value: "HiCola Energy" },
    { label: "HiCola Xtreme - £14.99", value: "HiCola Xtreme" },
    { label: "HiCola Sport - £15.99", value: "HiCola Sport" },
    { label: "HiCola Rime (NEW) - £16.99", value: "HiCola Rime" },
    { label: "Tap water - £10.50", value: "Tap water" },
    { label: "Instant coffee - £9.20", value: "Instant coffee" },
    { label: "Hot chocolate - £11.20", value: "Hot chocolate" },
    { label: "Nothing - £15.99", value: "Nothing" }
  ];

  const foodOptions = [
    { label: "Cakes & Bakes (Optional)", value: "" },
    { label: "Sponges (From £16.00)", value: "Sponges" },
    { label: "Traybakes (From £14.00)", value: "Traybakes" },
    { label: "Biscuits (From £7.00)", value: "Biscuits" }
  ];

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
      if (!formData.hotDrink && !formData.coldDrink && !formData.foodItem) {
        setErrorMessage("Please select at least one item from the menu."); return;
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

    let orderSummary = [];
    if (formData.hotDrink) orderSummary.push(`Hot: ${formData.hotDrink}`);
    if (formData.coldDrink) orderSummary.push(`Cold: ${formData.coldDrink}`);
    if (formData.foodItem) orderSummary.push(`Food: ${formData.foodItem}`);

    try {
      await addDoc(collection(db, "restaurant_orders"), {
        email: currentUser?.email || "Unknown Guest", restaurant: formData.branch,
        customerName: formData.orderName, tableNumber: formData.tableNumber,
        menu: "Barista by The Highland Cafe",
        drinkItems: orderSummary.filter(i => i.includes("Hot:") || i.includes("Cold:")).join(" | ") || "None",
        foodItems: formData.foodItem || "None",
        allergens: formData.hasAllergens === "Yes" ? formData.allergenDetails : "None",
        additionalNotes: `Sizes/Prefs: ${formData.sizePrefs || "N/A"} | Notes: ${formData.notes || "None"}`,
        createdAt: serverTimestamp(), status: "pending"
      });

      setStatus("success"); window.scrollTo({ top: 0, behavior: "smooth" }); setStep(1);
      setFormData({
        branch: "", orderName: currentUser?.displayName || "", tableNumber: "",
        hotDrink: "", coldDrink: "", foodItem: "", sizePrefs: "", hasAllergens: "", allergenDetails: "", notes: ""
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
        <span className="material-symbols-rounded imageIcon mb-2" style={{ color: "var(--primary)" }}>local_cafe</span>
        <h3 className="card-title text-center mb-2">Order received!</h3>
        <p className="subtitle mb-3">Your world-class pre-ground coffee is being prepared. We will bring it to Table {formData.tableNumber} shortly.</p>
        <MenuActionBtn icon="add_circle" text="New Order" className="full m-0 mt-3" onClick={() => setStatus("idle")} />
      </InfoBubble>
    );
  }

  return (
    <form onSubmit={step === 3 ? handleSubmit : handleNext} className="settings-group m-0 p-0 text-start">
      <span className="opacity-75 fw-bold ms-1" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>Step {step} of 3</span>
      <h4 className="blue-h3 mb-3 ms-1" style={{ fontSize: "1.3rem" }}>
        {step === 1 ? "Location & Table" : (step === 2 ? "Menu Selection" : "Final Details")}
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
          <Dropdown className="joinTop" options={hotDrinkOptions} value={formData.hotDrink} onChange={(val) => handleChange("hotDrink", val)} />
          <Dropdown className="joinMiddle" options={coldDrinkOptions} value={formData.coldDrink} onChange={(val) => handleChange("coldDrink", val)} />
          <Dropdown className="joinMiddle" options={foodOptions} value={formData.foodItem} onChange={(val) => handleChange("foodItem", val)} />
          <TextInput className="joinBottom" type="text" placeholder="Specify Size & Milk Prefs (e.g. Med Oat)" value={formData.sizePrefs} onChange={(e) => handleChange("sizePrefs", e.target.value)} />
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
          type="submit" className={step > 1 ? "joinTop m-0" : "full m-0"} icon={step === 3 ? "local_cafe" : "arrow_forward"}
          text={step === 3 ? (status === "submitting" ? "Sending..." : "Send Order") : "Next"} disabled={status === "submitting"}
        />
        {step > 1 && (
          <MenuActionBtn type="button" className="joinBottom m-0" icon="arrow_back" text="Back" onClick={handleBack} />
        )}
      </div>
    </form>
  );
}
