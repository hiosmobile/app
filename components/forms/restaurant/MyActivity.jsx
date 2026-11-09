import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../src/firebase"; 
import { useAuth } from "../../../src/AuthContext"; 
import { RippleButton, InfoBubble, Modal, TextInput, Dropdown } from "../../../components/HiMaterial"; // Adjusted to match your HiCafe imports

export default function MyActivity({ targetCollection }) {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ 
    dateBooked: "", timeBooked: "", peopleCount: 1, 
    menu: "", foodItems: "", drinkItems: "", tableNumber: "",
    roomNo: "", breakfastType: [], specialRequest: ""
  });

  const menus = [
    "Breakfast", "Lunch", "Dinner", "Eat Economy - Lunch/Dinner",
    "Desserts", "Children's", "Specials", "Gourmet"
  ].map(m => ({ label: m, value: m }));

  const breakfastOptions = [
    "Continental breakfast",
    "Cooked breakfast",
    "Breakfast rolls",
    "Other"
  ];

  const fetchMyActivity = async () => {
    if (!currentUser || !targetCollection) return;
    
    setLoading(true);
    try {
      // Query ONLY the collection passed in via the targetCollection prop
      const q = query(
        collection(db, targetCollection),
        where("email", "==", currentUser.email)
      );
      
      const snapshot = await getDocs(q);
      const fetched = [];
      snapshot.forEach((document) => {
        fetched.push({ id: document.id, type: targetCollection, ...document.data() });
      });
      
      // Sort newest created first
      fetched.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setActivities(fetched);
    } catch (err) {
      console.error("Error fetching activity: ", err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch automatically if the prop changes
  useEffect(() => {
    fetchMyActivity();
  }, [currentUser, targetCollection]); 

  const handleCancel = async (item) => {
    if (window.confirm("Are you sure you want to cancel this?")) {
      try {
        await deleteDoc(doc(db, targetCollection, item.id));
        setActivities(prev => prev.filter(a => a.id !== item.id));
      } catch (err) {
        alert("Could not cancel item.");
      }
    }
  };

  const handleCheckboxChange = (option) => {
    setEditForm(prev => {
      const currentTypes = prev.breakfastType;
      if (currentTypes.includes(option)) {
        return { ...prev, breakfastType: currentTypes.filter(item => item !== option) };
      } else {
        return { ...prev, breakfastType: [...currentTypes, option] };
      }
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, targetCollection, editingItem.id);
      let payload = {};

      if (targetCollection === "restaurant_bookings") {
        payload = {
            dateBooked: editForm.dateBooked,
            timeBooked: editForm.timeBooked,
            peopleCount: Number(editForm.peopleCount)
        };
      } else if (targetCollection === "restaurant_orders") {
        payload = {
            menu: editForm.menu,
            foodItems: editForm.foodItems,
            drinkItems: editForm.drinkItems,
            tableNumber: editForm.tableNumber
        };
      } else if (targetCollection === "breakfast_checkin") {
        payload = {
            date: editForm.dateBooked, 
            time: editForm.timeBooked,
            roomNumber: editForm.roomNo,
            breakfastType: editForm.breakfastType,
            additionalNotes: editForm.breakfastType.includes("Other") ? editForm.specialRequest : ""
        };
      }

      await updateDoc(docRef, payload);
      setEditingItem(null);
      fetchMyActivity(); 
    } catch (err) {
      alert("Could not update details.");
    }
  };

  const openEditModal = (item) => {
    setEditForm({
      dateBooked: item.dateBooked || item.date || "",
      timeBooked: item.timeBooked || item.time || "",
      peopleCount: item.peopleCount || 1,
      menu: item.menu || "Breakfast",
      foodItems: item.foodItems || "",
      drinkItems: item.drinkItems || "",
      tableNumber: item.tableNumber || "",
      roomNo: item.roomNumber || "",
      breakfastType: item.breakfastType || [],
      specialRequest: item.additionalNotes || ""
    });
    setEditingItem(item);
  };

  const isPastBooking = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return false;
    const bookingDateTime = new Date(`${dateStr}T${timeStr}`);
    return bookingDateTime < new Date();
  };

  const today = new Date().toISOString().split("T")[0];

  if (loading) return <p className="opacity-75 text-center mt-3">Loading your activity...</p>;

  if (activities.length === 0) {
    return (
      <div className="text-center mt-4 mb-3 opacity-50">
        <span className="material-symbols-rounded fs-1 mb-2">inbox</span>
        <p>You have no recent {targetCollection === "restaurant_bookings" ? "bookings" : (targetCollection === "restaurant_orders" ? "orders" : "check-ins")}.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3 mt-2">
      {activities.map((item) => {
        const isBooking = targetCollection === "restaurant_bookings";
        const isOrder = targetCollection === "restaurant_orders";
        const isBreakfast = targetCollection === "breakfast_checkin";
        
        const isPast = (isBooking || isBreakfast) ? isPastBooking(item.dateBooked || item.date, item.timeBooked || item.time) : false;
        
        let icon = "room_service";
        let title = "Kitchen Order";
        let subtitle = "Order details";
        
        if (isBooking) {
            icon = "table_restaurant";
            title = `Table at ${item.restaurant || "The Highland Cafe"}`;
            subtitle = "Reservation";
        } else if (isBreakfast) {
            icon = "free_breakfast";
            title = "Breakfast Check-in";
            subtitle = `Room ${item.roomNumber || "Unknown"}`;
        }

        return (
          <div key={item.id} className="position-relative">
            <InfoBubble icon={icon} title={title} className="full text-start p-3 m-0">
              
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold opacity-75" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>
                  {subtitle}
                </span>
                <span 
                  className="badge rounded-pill" 
                  style={{ 
                    backgroundColor: (item.status === "pending" || !item.status) ? "var(--secondaryContainer)" : "var(--tertiaryContainer)", 
                    color: (item.status === "pending" || !item.status) ? "var(--onSecondaryContainer)" : "var(--onTertiaryContainer)" 
                  }}
                >
                  {item.status || "pending"}
                </span>
              </div>

              {/* Conditional Data Display Based on targetCollection */}
              {isBooking && (
                <>
                  <p className="mb-1 fw-bold" style={{ fontSize: "0.95rem" }}>
                    {item.dateBooked} at {item.timeBooked}
                  </p>
                  <p className="mb-2 opacity-75" style={{ fontSize: "0.85rem" }}>
                    Table for {item.peopleCount} {item.peopleCount === 1 ? "person" : "people"}
                  </p>
                </>
              )}
              
              {isBreakfast && (
                <>
                  <p className="mb-1 fw-bold" style={{ fontSize: "0.95rem" }}>
                    {item.date} at {item.time}
                  </p>
                  <p className="mb-2 opacity-75" style={{ fontSize: "0.85rem" }}>
                    Choices: {Array.isArray(item.breakfastType) ? item.breakfastType.join(", ") : item.breakfastType}
                  </p>
                </>
              )}

              {isOrder && (
                <>
                  {item.tableNumber && <p className="mb-1 fw-bold" style={{ fontSize: "0.95rem" }}>Table {item.tableNumber}</p>}
                  {item.foodItems && item.foodItems !== "None" && <p className="mb-1" style={{ fontSize: "0.85rem" }}><strong>Food:</strong> {item.foodItems}</p>}
                  {item.drinkItems && item.drinkItems !== "None" && <p className="mb-1" style={{ fontSize: "0.85rem" }}><strong>Drinks:</strong> {item.drinkItems}</p>}
                </>
              )}

              {/* Action Buttons */}
              {!isPast && (item.status === "pending" || !item.status) ? (
                <div className="d-flex gap-2 mt-2 pt-2 border-top border-secondary border-opacity-25">
                  <RippleButton 
                    type="button"
                    className="navButtonInactive m-0" 
                    style={{ height: "30px", fontSize: "0.75rem", padding: "0 12px", backgroundColor: "transparent", color: "var(--error)" }}
                    onClick={() => handleCancel(item)}
                  >
                    Cancel
                  </RippleButton>
                  <RippleButton 
                    type="button"
                    className="navButton m-0 ms-auto" 
                    style={{ height: "30px", fontSize: "0.75rem", padding: "0 12px" }}
                    onClick={() => openEditModal(item)}
                  >
                    Edit Details
                  </RippleButton>
                </div>
              ) : (
                <p className="text-end mb-0 mt-2 pt-2 border-top border-secondary border-opacity-25 opacity-50 fw-bold" style={{ fontSize: "0.75rem" }}>
                  {item.status && item.status !== "pending" ? "This item is being processed and cannot be altered." : "This booking has passed."}
                </p>
              )}
            </InfoBubble>
          </div>
        );
      })}

      {/* Unified Edit Modal via React Portal */}
      {typeof document !== "undefined" && createPortal(
        <Modal 
          isOpen={!!editingItem} 
          onClose={() => setEditingItem(null)} 
          title={targetCollection === "restaurant_bookings" ? "Edit Booking" : (targetCollection === "breakfast_checkin" ? "Edit Breakfast Check-in" : "Edit Order")}
          appName="hi cafe"
        >
          <form onSubmit={handleSaveEdit} className="d-flex flex-column gap-3 text-start mt-2">
            
            {/* BOOKING INPUTS */}
            {targetCollection === "restaurant_bookings" && (
              <>
                <div>
                  <label className="form-check-label mb-1 fw-bold">Date</label>
                  <TextInput type="date" className="full-btn" min={today} required value={editForm.dateBooked} onChange={(e) => setEditForm({...editForm, dateBooked: e.target.value})} />
                </div>
                <div>
                  <label className="form-check-label mb-1 fw-bold">Time</label>
                  <TextInput type="time" className="full-btn" required value={editForm.timeBooked} onChange={(e) => setEditForm({...editForm, timeBooked: e.target.value})} />
                </div>
                <div>
                  <label className="form-check-label mb-1 fw-bold">Guests</label>
                  <TextInput type="number" className="full-btn" min="1" max="8" required value={editForm.peopleCount} onChange={(e) => setEditForm({...editForm, peopleCount: e.target.value})} />
                </div>
              </>
            )}

            {/* BREAKFAST CHECKIN INPUTS */}
            {targetCollection === "breakfast_checkin" && (
              <>
                <div>
                  <label className="form-check-label mb-1 fw-bold">Room</label>
                  <TextInput type="text" className="full-btn" required value={editForm.roomNo} onChange={(e) => setEditForm({...editForm, roomNo: e.target.value})} />
                </div>
                <div>
                  <label className="form-check-label mb-1 fw-bold">Date</label>
                  <TextInput type="date" className="full-btn" min={today} required value={editForm.dateBooked} onChange={(e) => setEditForm({...editForm, dateBooked: e.target.value})} />
                </div>
                <div>
                  <label className="form-check-label mb-1 fw-bold">Time</label>
                  <TextInput type="time" className="full-btn" required value={editForm.timeBooked} onChange={(e) => setEditForm({...editForm, timeBooked: e.target.value})} />
                </div>
                <div>
                    <label className="form-check-label mb-2 fw-bold">What kind of breakfast?</label>
                    <div className="d-flex flex-column gap-2 ms-2 mt-1">
                        {breakfastOptions.map(option => (
                        <div key={option} className="d-flex flex-column gap-1">
                            <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={editForm.breakfastType.includes(option)}
                                onChange={() => handleCheckboxChange(option)}
                                style={{ width: "20px", height: "20px", accentColor: "var(--primary)" }}
                            />
                            <span style={{ fontSize: "1rem" }}>{option}</span>
                            </label>
                            
                            {/* Dynamically render text input if 'Other' is checked */}
                            {option === "Other" && editForm.breakfastType.includes("Other") && (
                            <TextInput
                                className="full-btn mt-1"
                                type="text"
                                placeholder="Specify request"
                                value={editForm.specialRequest}
                                onChange={(e) => setEditForm({...editForm, specialRequest: e.target.value})}
                                style={{ width: "calc(100% - 28px)", marginLeft: "28px" }}
                            />
                            )}
                        </div>
                        ))}
                    </div>
                </div>
              </>
            )}

            {/* FOOD ORDER INPUTS */}
            {targetCollection === "restaurant_orders" && (
              <>
                <div>
                  <label className="form-check-label mb-1 fw-bold">Table Number</label>
                  <TextInput type="number" className="full-btn" required value={editForm.tableNumber} onChange={(e) => setEditForm({...editForm, tableNumber: e.target.value})} />
                </div>
                <div>
                  <label className="form-check-label mb-1 fw-bold">Menu</label>
                  <Dropdown className="full-btn" options={menus} value={editForm.menu} onChange={(val) => setEditForm({...editForm, menu: val})} />
                </div>
                <div>
                  <label className="form-check-label mb-1 fw-bold">Food Items</label>
                  <TextInput type="text" className="full-btn" value={editForm.foodItems} onChange={(e) => setEditForm({...editForm, foodItems: e.target.value})} />
                </div>
                <div>
                  <label className="form-check-label mb-1 fw-bold">Drink Items</label>
                  <TextInput type="text" className="full-btn" value={editForm.drinkItems} onChange={(e) => setEditForm({...editForm, drinkItems: e.target.value})} />
                </div>
              </>
            )}

            <div className="d-flex gap-2 mt-4">
              <RippleButton type="button" className="metro-list-btn flex-grow-1 m-0" style={{ backgroundColor: "var(--secondaryContainer)", color: "var(--onSecondaryContainer)" }} onClick={() => setEditingItem(null)}>
                <span className="button-text">Discard</span>
              </RippleButton>
              <RippleButton type="submit" className="metro-list-btn flex-grow-1 m-0">
                <span className="button-text">Save Changes</span>
              </RippleButton>
            </div>
          </form>
        </Modal>,
        document.body
      )}
    </div>
  );
}
