import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../src/firebase";
import { useAuth } from "../../../src/AuthContext";
import { Card, Row, Col, RippleButton, InfoBubble, Modal, TextInput, Dropdown } from "../../../components/HiMaterial";

export default function MyActivity({ targetCollection }) {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingItem, setEditingItem] = useState(null);
  const [cancelingItem, setCancelingItem] = useState(null);

  const [editForm, setEditForm] = useState({
    dateBooked: "", timeBooked: "", peopleCount: "",
    menu: "", foodItems: "", drinkItems: "", tableNumber: "",
    roomNo: "", breakfastType: [], specialRequest: "",
    location: "", checkIn: "", checkOut: "",
    adults: "", children: "", roomType: "", accessible: ""
  });

  const locationOptions = [{ label: "Select Location *", value: "" }, ...[
    "Aberdeen", "Manchester", "Edinburgh", "Glasgow", "Southampton", "Northampton",
    "Lancaster", "Inverness", "Mojácar", "Pyongyang", "Las Vegas", "Los Angeles", "Phoenix", "New York"
  ].map(loc => ({ label: loc, value: loc }))];

  const menuOptions = [{ label: "Select Menu *", value: "" }, ...["Breakfast", "Lunch", "Dinner", "Eat Economy - Lunch/Dinner", "Desserts", "Children's", "Specials", "Gourmet"].map(m => ({ label: m, value: m }))];
  const breakfastOptions = ["Continental breakfast", "Cooked breakfast", "Breakfast rolls", "Other"];
  const roomOptions = [{ label: "Select Room Type *", value: "" }, ...["Single En-suite", "Double En-suite", "Twin En-suite", "Family En-suite"].map(type => ({ label: type, value: type }))];
  const yesNoOptions = [{ label: "Require Accessible Room? *", value: "" }, { label: "No", value: "No" }, { label: "Yes", value: "Yes" }];

  const today = new Date().toISOString().split("T")[0];

  const fetchMyActivity = async () => {
    if (!currentUser || !targetCollection) return;
    setLoading(true);
    try {
      const q = query(collection(db, targetCollection), where("email", "==", currentUser.email));
      const snapshot = await getDocs(q);
      const fetched = [];
      snapshot.forEach((document) => {
        fetched.push({ id: document.id, type: targetCollection, ...document.data() });
      });
      fetched.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setActivities(fetched);
    } catch (err) {
      console.error("Error fetching activity: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyActivity();
  }, [currentUser, targetCollection]);

  const confirmCancel = async () => {
    if (!cancelingItem) return;
    try {
      await deleteDoc(doc(db, targetCollection, cancelingItem.id));
      setActivities(prev => prev.filter(a => a.id !== cancelingItem.id));
      setCancelingItem(null);
    } catch (err) {
      alert("Could not cancel item. Please check your connection.");
      setCancelingItem(null);
    }
  };

  const handleCheckboxChange = (option) => {
    setEditForm(prev => {
      const currentTypes = prev.breakfastType;
      if (currentTypes.includes(option)) return { ...prev, breakfastType: currentTypes.filter(item => item !== option) };
      return { ...prev, breakfastType: [...currentTypes, option] };
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, targetCollection, editingItem.id);
      let payload = {};

      if (targetCollection === "restaurant_bookings") {
        payload = { dateBooked: editForm.dateBooked, timeBooked: editForm.timeBooked, peopleCount: Number(editForm.peopleCount) };
      } else if (targetCollection === "restaurant_orders") {
        payload = { menu: editForm.menu, foodItems: editForm.foodItems, drinkItems: editForm.drinkItems, tableNumber: editForm.tableNumber };
      } else if (targetCollection === "breakfast_checkin") {
        payload = { date: editForm.dateBooked, time: editForm.timeBooked, roomNumber: editForm.roomNo, breakfastType: editForm.breakfastType, additionalNotes: editForm.breakfastType.includes("Other") ? editForm.specialRequest : "" };
      } else if (targetCollection === "hotel_bookings") {
        const start = new Date(editForm.checkIn);
        const end = new Date(editForm.checkOut);
        const calculatedNights = Math.round((end - start) / (1000 * 60 * 60 * 24));

        payload = {
            location: editForm.location, startDate: editForm.checkIn, endDate: editForm.checkOut,
            nights: calculatedNights, adults: Number(editForm.adults), children: Number(editForm.children),
            roomType: editForm.roomType, accessibleRoom: editForm.accessible, additionalNotes: editForm.specialRequest
        };
      } else if (targetCollection === "hotel_checkin") {
        payload = { location: editForm.location, date: editForm.dateBooked, time: editForm.timeBooked, additionalNotes: editForm.specialRequest };
      } else if (targetCollection === "hotel_checkout") {
        payload = { location: editForm.location, roomNumber: editForm.roomNo, time: editForm.timeBooked, additionalNotes: editForm.specialRequest };
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
      dateBooked: item.dateBooked || item.date || "", timeBooked: item.timeBooked || item.time || "", peopleCount: item.peopleCount || "",
      menu: item.menu || "", foodItems: item.foodItems || "", drinkItems: item.drinkItems || "", tableNumber: item.tableNumber || "",
      roomNo: item.roomNumber || "", breakfastType: item.breakfastType || [], specialRequest: item.additionalNotes || "",
      location: item.location || "", checkIn: item.startDate || "", checkOut: item.endDate || "",
      adults: item.adults || "", children: item.children !== undefined ? item.children : "",
      roomType: item.roomType || "", accessible: item.accessibleRoom || ""
    });
    setEditingItem(item);
  };

  const isPastBooking = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return false;
    return new Date(`${dateStr}T${timeStr}`) < new Date();
  };

  if (loading) return <p className="opacity-75 text-center mt-3">Loading your activity...</p>;

  if (activities.length === 0) {
    let emptyNoun = "records";
    if (targetCollection === "restaurant_bookings") emptyNoun = "bookings";
    if (targetCollection === "restaurant_orders") emptyNoun = "orders";
    if (targetCollection === "breakfast_checkin") emptyNoun = "breakfast check-ins";
    if (targetCollection === "hotel_bookings") emptyNoun = "stays";
    if (targetCollection === "hotel_checkin") emptyNoun = "hotel check-ins";
    if (targetCollection === "hotel_checkout") emptyNoun = "hotel check-outs";

    return (
      <Card className="rightColJoinTop joinBottomRight-mobile text-center py-5 m-0 metro-anim-list-item delay-1" bodyClass="d-flex flex-column align-items-center justify-content-center">
        <span className="material-symbols-rounded imageIcon opacity-50 mb-2">inbox</span>
        <p className="opacity-75 mb-0">You have no recent {emptyNoun}.</p>
      </Card>
    );
  }

  return (
    <div className="d-flex flex-column m-0 p-0">
      {activities.map((item, index) => {
        const isBooking = targetCollection === "restaurant_bookings";
        const isOrder = targetCollection === "restaurant_orders";
        const isBreakfast = targetCollection === "breakfast_checkin";
        const isHotel = targetCollection === "hotel_bookings";
        const isCheckin = targetCollection === "hotel_checkin";
        const isCheckout = targetCollection === "hotel_checkout";

        const isPast = isHotel
          ? (new Date(item.endDate) < new Date())
          : ((isBooking || isBreakfast || isCheckin || isCheckout) ? isPastBooking(item.dateBooked || item.date, item.timeBooked || item.time) : false);

        const isFirst = index === 0;
        const isLast = index === activities.length - 1;

        let joinClass = "joinMiddle";
        if (isFirst && isLast) {
          joinClass = "rightColJoinTop joinBottomRight-mobile";
        } else if (isFirst) {
          joinClass = "rightColJoinTop";
        } else if (isLast) {
          joinClass = "joinBottomRight";
        }

        const delayNum = Math.min(index + 2, 10);
        const cardClass = `${joinClass} metro-anim-list-item delay-${delayNum}`;

        let icon = "room_service"; let title = "Kitchen Order"; let subtitle = "Order details";
        if (isBooking) { icon = "table_restaurant"; title = `Table at ${item.restaurant || "The Highland Cafe"}`; subtitle = "Reservation"; }
        else if (isBreakfast) { icon = "free_breakfast"; title = "Breakfast Check-in"; subtitle = `Room ${item.roomNumber || "Unknown"}`; }
        else if (isHotel) { icon = "bed"; title = `weB&B ${item.location || ""}`; subtitle = "Hotel Reservation"; }
        else if (isCheckin) { icon = "how_to_reg"; title = `weB&B ${item.location || ""}`; subtitle = "Check-in"; }
        else if (isCheckout) { icon = "logout"; title = `weB&B ${item.location || ""}`; subtitle = "Check-out"; }

        return (
          <Card key={item.id} className={cardClass} bodyClass="p-3 text-start">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h2 className="blue-h3 m-0" style={{ fontSize: "1.5rem" }}>{title}</h2>
                <p className="mb-0 opacity-75 fw-bold" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>{subtitle}</p>
              </div>
              <span className="badge px-3 py-2 rounded-pill fw-bold mt-1" style={{ backgroundColor: (item.status === "pending" || !item.status) ? "var(--secondaryContainer)" : "var(--tertiaryContainer)", color: (item.status === "pending" || !item.status) ? "var(--onSecondaryContainer)" : "var(--onTertiaryContainer)", border: `1px solid ${(item.status === "pending" || !item.status) ? "var(--onSecondaryContainer)" : "var(--onTertiaryContainer)"}`, fontSize: "0.85rem", textTransform: "lowercase" }}>
                {item.status || "pending"}
              </span>
            </div>

            <div className="mt-3">
              {(isBooking || isBreakfast) && (
                <Row className="g-1 mb-2">
                  <Col size={6}><InfoBubble icon="schedule" title="Timing" className="joinLeft h-100 m-0">{item.dateBooked || item.date} <br/> at {item.timeBooked || item.time}</InfoBubble></Col>
                  <Col size={6}><InfoBubble icon={icon} title={isBooking ? "Guests" : "Details"} className="joinRight h-100 m-0">{isBooking ? `${item.peopleCount} ${item.peopleCount === 1 ? "person" : "people"}` : (Array.isArray(item.breakfastType) ? item.breakfastType.join(", ") : item.breakfastType)}</InfoBubble></Col>
                </Row>
              )}

              {isHotel && (
                <Row className="g-1 mb-2">
                  <Col size={6}><InfoBubble icon="calendar_today" title="Stay" className="joinLeft h-100 m-0">{item.startDate} to {item.endDate} <br/> ({item.nights} nights)</InfoBubble></Col>
                  <Col size={6}><InfoBubble icon="group" title="Room & Guests" className="joinRight h-100 m-0">{item.adults} Adults, {item.children} Children <br/> {item.roomType}</InfoBubble></Col>
                </Row>
              )}

              {(isCheckin || isCheckout) && (
                <Row className="g-1 mb-2">
                  <Col size={6}><InfoBubble icon="schedule" title={isCheckin ? "Arrival" : "Departure"} className="joinLeft h-100 m-0">{item.date} <br/> at {item.time}</InfoBubble></Col>
                  <Col size={6}><InfoBubble icon={isCheckin ? "badge" : "meeting_room"} title={isCheckin ? "Guest" : "Room"} className="joinRight h-100 m-0">{isCheckin ? item.lastName : `Room ${item.roomNumber}`}</InfoBubble></Col>
                </Row>
              )}

              {isOrder && (
                <>
                  <Row className="g-1 mb-2">
                    <Col size={6}><InfoBubble icon="table_restaurant" title="Table" className="joinLeft h-100 m-0">Table {item.tableNumber}</InfoBubble></Col>
                    <Col size={6}><InfoBubble icon="restaurant_menu" title="Menu" className="joinRight h-100 m-0">{item.menu}</InfoBubble></Col>
                  </Row>
                  {(item.foodItems || item.drinkItems) && (
                    <InfoBubble icon="room_service" title="Order Items" className="full m-0 mb-2 text-start">
                      {item.foodItems && item.foodItems !== "None" && <p className="mb-1" style={{ fontSize: "0.85rem" }}><strong>Food:</strong> {item.foodItems}</p>}
                      {item.drinkItems && item.drinkItems !== "None" && <p className="mb-1" style={{ fontSize: "0.85rem" }}><strong>Drinks:</strong> {item.drinkItems}</p>}
                    </InfoBubble>
                  )}
                </>
              )}

              {item.additionalNotes && (
                <InfoBubble icon="info" title="Notes & Details" className="full m-0 mb-2 text-start">
                   <p className="mb-1" style={{ fontSize: "0.85rem" }}>{item.additionalNotes}</p>
                </InfoBubble>
              )}

              {!isPast && (item.status === "pending" || !item.status) ? (
                <Row className="g-1 mt-2">
                  <Col size={6}>
                    <RippleButton type="button" className="metro-list-btn m-0 joinLeft justify-content-center" style={{ height: "45px", backgroundColor: "color-mix(in srgb, var(--errorContainer) 70%, transparent)", color: "var(--onErrorContainer)" }} onClick={() => setCancelingItem(item)}>
                      <span className="material-symbols-rounded" style={{ fontSize: "20px" }}>cancel</span>
                      <span className="button-text" style={{ fontSize: "0.95rem" }}>Cancel</span>
                    </RippleButton>
                  </Col>
                  <Col size={6}>
                    <RippleButton type="button" className="metro-list-btn m-0 joinRight justify-content-center" style={{ height: "45px" }} onClick={() => openEditModal(item)}>
                      <span className="material-symbols-rounded" style={{ fontSize: "20px" }}>edit</span>
                      <span className="button-text" style={{ fontSize: "0.95rem" }}>Edit Details</span>
                    </RippleButton>
                  </Col>
                </Row>
              ) : (
                <p className="text-end mb-0 mt-3 pt-2 border-top border-secondary border-opacity-25 opacity-50 fw-bold" style={{ fontSize: "0.75rem" }}>
                  {item.status && item.status !== "pending" ? "This item is being processed and cannot be altered." : "This record has passed."}
                </p>
              )}
            </div>
          </Card>
        );
      })}

      {typeof document !== "undefined" && createPortal(
        <Modal
          isOpen={!!editingItem} onClose={() => setEditingItem(null)} appName="hi cafe"
          title={
            targetCollection === "restaurant_bookings" ? "Edit Booking" :
            targetCollection === "breakfast_checkin" ? "Edit Breakfast" :
            targetCollection === "hotel_bookings" ? "Edit Stay Details" :
            targetCollection === "hotel_checkin" ? "Edit Check-in" :
            targetCollection === "hotel_checkout" ? "Edit Check-out" : "Edit Order"
          }
        >
          <form onSubmit={handleSaveEdit} className="settings-group m-0 p-0 text-start mt-2">

            {targetCollection === "restaurant_bookings" && (
              <div className="mb-4">
                <TextInput className="joinTop" type="text" placeholder="Date *" onFocus={(e) => e.target.type = "date"} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} required min={today} value={editForm.dateBooked} onChange={(e) => setEditForm({...editForm, dateBooked: e.target.value})} />
                <TextInput className="joinMiddle" type="text" placeholder="Time *" onFocus={(e) => e.target.type = "time"} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} required value={editForm.timeBooked} onChange={(e) => setEditForm({...editForm, timeBooked: e.target.value})} />
                <TextInput className="joinBottom" type="number" min="1" max="8" placeholder="Number of Guests *" required value={editForm.peopleCount} onChange={(e) => setEditForm({...editForm, peopleCount: e.target.value})} />
              </div>
            )}

            {targetCollection === "breakfast_checkin" && (
              <>
                <div className="mb-3">
                  <TextInput className="joinTop" type="text" placeholder="Room Number *" required value={editForm.roomNo} onChange={(e) => setEditForm({...editForm, roomNo: e.target.value})} />
                  <TextInput className="joinMiddle" type="text" placeholder="Date *" onFocus={(e) => e.target.type = "date"} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} required min={today} value={editForm.dateBooked} onChange={(e) => setEditForm({...editForm, dateBooked: e.target.value})} />
                  <TextInput className="joinBottom" type="text" placeholder="Time *" onFocus={(e) => e.target.type = "time"} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} required value={editForm.timeBooked} onChange={(e) => setEditForm({...editForm, timeBooked: e.target.value})} />
                </div>
                <InfoBubble className="full m-0 mb-4 p-3 border-0">
                  <label className="form-check-label mb-3 fw-bold">Breakfast Type *</label>
                  <div className="d-flex flex-column gap-3 ms-1">
                    {breakfastOptions.map(option => (
                      <div key={option} className="d-flex flex-column gap-1">
                        <label className="d-flex align-items-center gap-2 m-0" style={{ cursor: "pointer" }}>
                          <input type="checkbox" value={option} checked={editForm.breakfastType.includes(option)} onChange={() => handleCheckboxChange(option)} style={{ width: "20px", height: "20px", accentColor: "var(--primary)" }} />
                          <span style={{ fontSize: "1rem" }}>{option}</span>
                        </label>
                        {option === "Other" && editForm.breakfastType.includes("Other") && (
                          <TextInput className="full mt-2" type="text" placeholder="Specify request..." required value={editForm.specialRequest} onChange={(e) => setEditForm({...editForm, specialRequest: e.target.value})} style={{ width: "calc(100% - 30px)", marginLeft: "30px" }} />
                        )}
                      </div>
                    ))}
                  </div>
                </InfoBubble>
              </>
            )}

            {targetCollection === "hotel_bookings" && (
              <div className="mb-4">
                <Dropdown className="joinTop" options={locationOptions} value={editForm.location} onChange={(val) => setEditForm({...editForm, location: val})} />
                <TextInput className="joinMiddle" type="text" placeholder="Check-in Date *" onFocus={(e) => e.target.type = "date"} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} required min={today} value={editForm.checkIn} onChange={(e) => setEditForm({...editForm, checkIn: e.target.value})} />
                <TextInput className="joinMiddle" type="text" placeholder="Check-out Date *" onFocus={(e) => e.target.type = "date"} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} required min={editForm.checkIn || today} value={editForm.checkOut} onChange={(e) => setEditForm({...editForm, checkOut: e.target.value})} />
                <Dropdown className="joinMiddle" options={roomOptions} value={editForm.roomType} onChange={(val) => setEditForm({...editForm, roomType: val})} />
                <Dropdown className="joinMiddle" options={yesNoOptions} value={editForm.accessible} onChange={(val) => setEditForm({...editForm, accessible: val})} />
                <TextInput className="joinBottom" type="text" placeholder="Special Requests" value={editForm.specialRequest} onChange={(e) => setEditForm({...editForm, specialRequest: e.target.value})} />
              </div>
            )}

            {targetCollection === "hotel_checkin" && (
              <div className="mb-4">
                <Dropdown className="joinTop" options={locationOptions} value={editForm.location} onChange={(val) => setEditForm({...editForm, location: val})} />
                <TextInput className="joinMiddle" type="text" placeholder="Arrival Date *" onFocus={(e) => e.target.type = "date"} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} required min={today} value={editForm.dateBooked} onChange={(e) => setEditForm({...editForm, dateBooked: e.target.value})} />
                <TextInput className="joinMiddle" type="text" placeholder="Arrival Time *" onFocus={(e) => e.target.type = "time"} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} required value={editForm.timeBooked} onChange={(e) => setEditForm({...editForm, timeBooked: e.target.value})} />
                <TextInput className="joinBottom" type="text" placeholder="Notes & Requests" value={editForm.specialRequest} onChange={(e) => setEditForm({...editForm, specialRequest: e.target.value})} />
              </div>
            )}

            {targetCollection === "hotel_checkout" && (
              <div className="mb-4">
                <Dropdown className="joinTop" options={locationOptions} value={editForm.location} onChange={(val) => setEditForm({...editForm, location: val})} />
                <TextInput className="joinMiddle" type="text" placeholder="Room Number *" required value={editForm.roomNo} onChange={(e) => setEditForm({...editForm, roomNo: e.target.value})} />
                <TextInput className="joinMiddle" type="text" placeholder="Departure Time *" onFocus={(e) => e.target.type = "time"} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} required value={editForm.timeBooked} onChange={(e) => setEditForm({...editForm, timeBooked: e.target.value})} />
                <TextInput className="joinBottom" type="text" placeholder="Comments" value={editForm.specialRequest} onChange={(e) => setEditForm({...editForm, specialRequest: e.target.value})} />
              </div>
            )}

            {targetCollection === "restaurant_orders" && (
              <div className="mb-4">
                <TextInput className="joinTop" type="number" placeholder="Table Number *" required value={editForm.tableNumber} onChange={(e) => setEditForm({...editForm, tableNumber: e.target.value})} />
                <Dropdown className="joinMiddle" options={menuOptions} value={editForm.menu} onChange={(val) => setEditForm({...editForm, menu: val})} />
                <TextInput className="joinMiddle" type="text" placeholder="Food Items" value={editForm.foodItems} onChange={(e) => setEditForm({...editForm, foodItems: e.target.value})} />
                <TextInput className="joinBottom" type="text" placeholder="Drink Items" value={editForm.drinkItems} onChange={(e) => setEditForm({...editForm, drinkItems: e.target.value})} />
              </div>
            )}

            <div className="d-flex gap-2 mt-2">
              <RippleButton type="button" className="metro-list-btn flex-grow-1 m-0 joinLeft justify-content-center" style={{ backgroundColor: "var(--secondaryContainer)", color: "var(--onSecondaryContainer)" }} onClick={() => setEditingItem(null)}>
                <span className="button-text">Discard</span>
              </RippleButton>
              <RippleButton type="submit" className="metro-list-btn flex-grow-1 m-0 joinRight justify-content-center">
                <span className="button-text">Save</span>
              </RippleButton>
            </div>
          </form>
        </Modal>,
        document.body
      )}

      {typeof document !== "undefined" && createPortal(
        <Modal
          isOpen={!!cancelingItem}
          onClose={() => setCancelingItem(null)}
          appName="hi cafe"
          title="Cancel Reservation"
          color="var(--error)"
        >
          <p className="text-start mb-4" style={{ fontSize: "1.1rem" }}>
            Are you sure you want to cancel this {
              targetCollection === "restaurant_bookings" ? "booking" :
              targetCollection === "restaurant_orders" ? "order" :
              targetCollection === "hotel_checkin" ? "check-in" :
              targetCollection === "hotel_checkout" ? "check-out" :
              targetCollection === "hotel_bookings" ? "hotel stay" : "request"
            }? This action cannot be undone.
          </p>
          <div className="d-flex gap-2 mt-4">
            <RippleButton
              type="button"
              className="metro-list-btn m-0 joinLeft flex-grow-1 justify-content-center"
              style={{ backgroundColor: "var(--secondaryContainer)", color: "var(--onSecondaryContainer)" }}
              onClick={() => setCancelingItem(null)}
            >
              <span className="button-text">Nevermind</span>
            </RippleButton>
            <RippleButton
              type="button"
              className="metro-list-btn m-0 joinRight flex-grow-1 justify-content-center"
              style={{ backgroundColor: "var(--error)", color: "var(--onError)" }}
              onClick={confirmCancel}
            >
              <span className="material-symbols-rounded">delete_forever</span>
              <span className="button-text">Cancel It</span>
            </RippleButton>
          </div>
        </Modal>,
        document.body
      )}
    </div>
  );
}
