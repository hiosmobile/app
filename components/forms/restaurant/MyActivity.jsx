import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../src/firebase"; 
import { useAuth } from "../../../src/AuthContext"; 
import { RippleButton, InfoBubble, Modal, TextInput, Dropdown } from "../../HiMaterial";

// Accept targetCollection as a prop
export default function MyActivity({ targetCollection }) {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ 
    dateBooked: "", timeBooked: "", peopleCount: 1, 
    menu: "", foodItems: "", drinkItems: "", tableNumber: "" 
  });

  const menus = [
    "Breakfast", "Lunch", "Dinner", "Eat Economy - Lunch/Dinner",
    "Desserts", "Children's", "Specials", "Gourmet"
  ].map(m => ({ label: m, value: m }));

  const fetchMyActivity = async () => {
    if (!targetCollection) return; // Guard clause
    
    setLoading(true);
    try {
      const q = query(
        collection(db, targetCollection),
        where("email", "==", currentUser.email)
      );
      
      const snapshot = await getDocs(q);
      const fetched = [];
      snapshot.forEach((document) => {
        // Tag it with the targetCollection so the edit modal knows how to render
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

  useEffect(() => {
    if (currentUser) fetchMyActivity();
  }, [currentUser, targetCollection]); // Re-fetch if the prop changes

  const handleCancel = async (item) => {
    if (window.confirm("Are you sure you want to cancel this?")) {
      try {
        await deleteDoc(doc(db, item.type, item.id));
        setActivities(prev => prev.filter(a => a.id !== item.id));
      } catch (err) {
        alert("Could not cancel item.");
      }
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, editingItem.type, editingItem.id);
      
      // Build the payload dynamically based on what type of order it is
      const payload = editingItem.type === "restaurant_bookings" 
        ? {
            dateBooked: editForm.dateBooked,
            timeBooked: editForm.timeBooked,
            peopleCount: Number(editForm.peopleCount)
          }
        : {
            menu: editForm.menu,
            foodItems: editForm.foodItems,
            drinkItems: editForm.drinkItems,
            tableNumber: editForm.tableNumber
          };

      await updateDoc(docRef, payload);
      setEditingItem(null);
      fetchMyActivity(); 
    } catch (err) {
      alert("Could not update details.");
    }
  };

  const openEditModal = (item) => {
    setEditForm({
      dateBooked: item.dateBooked || "",
      timeBooked: item.timeBooked || "",
      peopleCount: item.peopleCount || 1,
      menu: item.menu || "Breakfast",
      foodItems: item.foodItems || "",
      drinkItems: item.drinkItems || "",
      tableNumber: item.tableNumber || ""
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
        <p>You have no recent activity.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3 mt-2">
      {activities.map((item) => {
        const isBooking = item.type === "restaurant_bookings";
        const isPast = isBooking ? isPastBooking(item.dateBooked, item.timeBooked) : false;
        
        // Use different icons and titles based on the type
        const icon = isBooking ? "table_restaurant" : "room_service";
        const title = isBooking ? `Table at ${item.restaurant}` : `Food Order at ${item.restaurant}`;

        return (
          <div key={item.id} className="position-relative">
            <InfoBubble icon={icon} title={title} className="full text-start p-3 m-0">
              
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold opacity-75" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>
                  {isBooking ? "Reservation" : "Kitchen Order"}
                </span>
                <span 
                  className="badge rounded-pill" 
                  style={{ 
                    backgroundColor: item.status === "pending" ? "var(--secondaryContainer)" : "var(--tertiaryContainer)", 
                    color: item.status === "pending" ? "var(--onSecondaryContainer)" : "var(--onTertiaryContainer)" 
                  }}
                >
                  {item.status}
                </span>
              </div>

              {/* Conditional Data Display */}
              {isBooking ? (
                <>
                  <p className="mb-1 fw-bold" style={{ fontSize: "0.95rem" }}>
                    {item.dateBooked} at {item.timeBooked}
                  </p>
                  <p className="mb-2 opacity-75" style={{ fontSize: "0.85rem" }}>
                    Table for {item.peopleCount} {item.peopleCount === 1 ? "person" : "people"}
                  </p>
                </>
              ) : (
                <>
                  {item.tableNumber && <p className="mb-1 fw-bold" style={{ fontSize: "0.95rem" }}>Table {item.tableNumber}</p>}
                  {item.foodItems && item.foodItems !== "None" && <p className="mb-1" style={{ fontSize: "0.85rem" }}><strong>Food:</strong> {item.foodItems}</p>}
                  {item.drinkItems && item.drinkItems !== "None" && <p className="mb-1" style={{ fontSize: "0.85rem" }}><strong>Drinks:</strong> {item.drinkItems}</p>}
                </>
              )}

              {/* Action Buttons */}
              {!isPast && item.status === "pending" ? (
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
                  {item.status !== "pending" ? "This order is being processed and cannot be altered." : "This booking has passed."}
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
          title={editingItem?.type === "restaurant_bookings" ? "Edit Booking" : "Edit Order"}
          appName="hi cafe"
        >
          <form onSubmit={handleSaveEdit} className="d-flex flex-column gap-3 text-start mt-2">
            
            {/* BOOKING INPUTS */}
            {editingItem?.type === "restaurant_bookings" && (
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

            {/* FOOD ORDER INPUTS */}
            {editingItem?.type === "restaurant_orders" && (
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