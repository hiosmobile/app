import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { Card, PageHeader, Row, Col, RippleButton, Dropdown, InfoBubble, Modal } from "../../components/HiMaterial";
import { useAuth } from "../AuthContext";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // New 2-Tier Tab State
  const [adminCategory, setAdminCategory] = useState("restaurant"); // 'restaurant' or 'hotel'
  const [activeTab, setActiveTab] = useState("restaurant_bookings");

  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [showHidden, setShowHidden] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const ADMIN_EMAIL = "jefaar80@gmail.com";

  const handleCategoryChange = (category) => {
    setAdminCategory(category);
    setLocationFilter("All Locations");
    if (category === "restaurant") setActiveTab("restaurant_bookings");
    else setActiveTab("hotel_bookings");
  };

  useEffect(() => {
    if (currentUser?.email !== ADMIN_EMAIL) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, activeTab), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedData = [];
      snapshot.forEach((document) => {
        fetchedData.push({ id: document.id, ...document.data() });
      });
      setDataList(fetchedData);
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching ${activeTab}: `, error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, activeTab]);

  const handleUpdateStatus = async (docId, newStatus) => {
    try {
      const docRef = doc(db, activeTab, docId);
      await updateDoc(docRef, { status: newStatus });
    } catch (err) {
      alert("Network error. Could not update status.");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, activeTab, itemToDelete));
      setItemToDelete(null);
    } catch (err) {
      alert("Network error. Could not delete record.");
      setItemToDelete(null);
    }
  };

  if (currentUser?.email !== ADMIN_EMAIL) {
    return (
      <main className="container mt-4 mb-5">
        <Row><Col size={12}>
          <Card className="text-center p-5 joinTop">
            <h3 className="blue-h2" style={{ fontSize: "1.5rem" }}>access denied</h3>
          </Card>
        </Col></Row>
      </main>
    );
  }

  const uniqueLocations = ["All Locations", ...new Set(dataList.map(item => item.restaurant || item.location).filter(Boolean))];
  const locationOptions = uniqueLocations.map(loc => ({ label: loc, value: loc }));

  const filteredList = dataList.filter(item => {
    const matchesLocation = locationFilter === "All Locations" || (item.restaurant || item.location) === locationFilter;
    const isCompletedOrDenied = item.status === "completed" || item.status === "denied";
    return matchesLocation && (showHidden ? true : !isCompletedOrDenied);
  });

  const getBadgeStyle = (status) => {
    switch(status) {
      case "approved": return { bg: "var(--tertiaryContainer)", text: "var(--onTertiaryContainer)" };
      case "completed": return { bg: "var(--primaryContainer)", text: "var(--onPrimaryContainer)" };
      case "denied": return { bg: "var(--errorContainer)", text: "var(--onErrorContainer)" };
      default: return { bg: "var(--secondaryContainer)", text: "var(--onSecondaryContainer)" };
    }
  };

  return (
    <>
      <main className="container mt-4 mb-5">
        <Row>
          <Col size={12}>
            <PageHeader title="Staff Portal" subtitle="Manage incoming requests and orders." className="joinTop pb-3" />
          </Col>
        </Row>

        <Row>
          <Col size={12}>
            <Card className="joinMiddle" bodyClass="p-2">

              {/* Top Tier: Category Toggle */}
              <div className="joinTop sub-nav-pills-header mb-2" style={{ backgroundColor: "color-mix(in srgb, var(--secondaryContainer) 40%, transparent)" }}>
                <button
                  className={`sub-header-tab ripple-button ${adminCategory === "restaurant" ? "active" : ""}`}
                  onClick={() => handleCategoryChange("restaurant")}
                >
                  <span className="material-symbols-rounded me-2" style={{ fontSize: "20px" }}>restaurant</span>
                  Restaurant
                </button>
                <button
                  className={`sub-header-tab ripple-button ${adminCategory === "hotel" ? "active" : ""}`}
                  onClick={() => handleCategoryChange("hotel")}
                >
                  <span className="material-symbols-rounded me-2" style={{ fontSize: "20px" }}>hotel</span>
                  Hotel
                </button>
              </div>

              {/* Second Tier: Sub Tabs */}
              <div className="sub-nav-pills-header joinBottom">
                {adminCategory === "restaurant" ? (
                  <>
                    <button className={`sub-header-tab ripple-button ${activeTab === "restaurant_bookings" ? "active" : ""}`} onClick={() => setActiveTab("restaurant_bookings")}>Table Bookings</button>
                    <button className={`sub-header-tab ripple-button ${activeTab === "restaurant_orders" ? "active" : ""}`} onClick={() => setActiveTab("restaurant_orders")}>Food Orders</button>
                    <button className={`sub-header-tab ripple-button ${activeTab === "breakfast_checkin" ? "active" : ""}`} onClick={() => setActiveTab("breakfast_checkin")}>Breakfast</button>
                  </>
                ) : (
                  <>
                    <button className={`sub-header-tab ripple-button ${activeTab === "hotel_bookings" ? "active" : ""}`} onClick={() => setActiveTab("hotel_bookings")}>Bookings</button>
                    <button className={`sub-header-tab ripple-button ${activeTab === "hotel_checkin" ? "active" : ""}`} onClick={() => setActiveTab("hotel_checkin")}>Check-in</button>
                    <button className={`sub-header-tab ripple-button ${activeTab === "hotel_checkout" ? "active" : ""}`} onClick={() => setActiveTab("hotel_checkout")}>Check-out</button>
                  </>
                )}
              </div>

            </Card>
          </Col>
        </Row>

        <Row>
          <Col size={12}>
            <Card className="joinMiddle" bodyClass="p-2 d-flex gap-2">
              <div className="flex-grow-1">
                <Dropdown options={locationOptions} value={locationFilter} onChange={(val) => setLocationFilter(val)} className="mb-0" disabled={uniqueLocations.length <= 1} style={{ margin: 0 }} />
              </div>
              <RippleButton
                className={showHidden ? "navButton" : "navButtonInactive"}
                style={{ width: "64px", height: "64px", margin: 0, borderRadius: "var(--radius-card)", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: showHidden ? "var(--primary)" : "var(--secondaryContainer)", color: showHidden ? "var(--onPrimary)" : "var(--onSecondaryContainer)" }}
                onClick={() => setShowHidden(!showHidden)}
              >
                <span className="material-symbols-rounded" style={{ margin: 0 }}>{showHidden ? "visibility" : "visibility_off"}</span>
              </RippleButton>
            </Card>
          </Col>
        </Row>

        <Row className="g-1">
          <Col size={12}>
            {loading ? (
              <Card className="text-center p-4 full"><p>Loading records...</p></Card>
            ) : filteredList.length === 0 ? (
              <Card className="text-center p-4 joinBottom">
                <span className="material-symbols-rounded fs-1 opacity-50 mb-2">inbox</span>
                <p>No active records found.</p>
              </Card>
            ) : (
              filteredList.map((item, index) => {
                const badge = getBadgeStyle(item.status);

                // Normalizer: Standardize the Name & Location
                const displayName = (item.firstName && item.lastName) ? `${item.firstName} ${item.lastName}` : (item.lastName || item.customerName || "Submission");
                const displayLocation = item.restaurant || item.location || (adminCategory === "hotel" ? "WorstEastern Hotel" : "The Highland Cafe");

                // Normalizer: Standardize the Time
                let displayTiming = "";
                if (activeTab === "hotel_bookings") {
                  displayTiming = `${item.startDate || "?"} to ${item.endDate || "?"} (${item.nights || 0} nights)`;
                } else {
                  const dDate = item.dateBooked || item.date || (item.createdAt ? new Date(item.createdAt.toDate()).toLocaleDateString() : "N/A");
                  const dTime = item.timeBooked || item.time ? ` at ${item.timeBooked || item.time}` : "";
                  displayTiming = `${dDate}${dTime}`;
                }

                // Normalizer: Standardize Space/Contact Info
                let spaceIcon = "mail";
                let spaceTitle = "Contact Phone / Email";
                let spaceText = item.phone || item.email || "No contact provided";

                if (activeTab === "hotel_bookings") {
                  spaceIcon = "bed"; spaceTitle = "Room Requirements";
                  spaceText = `${item.roomCount || 1}x ${item.roomType || "Room"} ${item.accessibleRoom === 'Yes' ? '(Accessible)' : ''}`;
                } else if (item.roomNumber) {
                  spaceIcon = "meeting_room"; spaceTitle = "Room Details";
                  spaceText = `Room ${item.roomNumber} (${item.peopleCount ? `${item.peopleCount} pax` : "1+ pax"})`;
                } else if (item.tableNumber) {
                  spaceIcon = "table_restaurant"; spaceTitle = "Table & Guests";
                  spaceText = `Table ${item.tableNumber} (${item.peopleCount ? `${item.peopleCount} pax` : "Size unknown"})`;
                }

                const hasNotes = item.foodItems || item.drinkItems || item.menu || item.breakfastType || item.additionalNotes || item.tellUs || (item.allergens && item.allergens !== "No");

                return (
                  <Card key={item.id} className={`${index === filteredList.length - 1 ? "joinBottom" : "joinMiddle"} text-start`} bodyClass="p-3">

                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h2 className="blue-h3 m-0" style={{ fontSize: "1.5rem", textTransform: "capitalize" }}>{displayName}</h2>
                        <p className="mb-0 opacity-75 fw-bold" style={{ fontSize: "0.9rem", textTransform: "capitalize" }}>{displayLocation}</p>
                      </div>
                      <span className="badge px-3 py-2 rounded-pill fw-bold mt-1" style={{ backgroundColor: badge.bg, color: badge.text, border: `1px solid ${badge.text}`, fontSize: "0.85rem", textTransform: "lowercase" }}>
                        {item.status || "pending"}
                      </span>
                    </div>

                    <Row className="g-1 mb-1">
                      <Col size={6}><InfoBubble icon="schedule" title="Timing" className="joinLeft h-100 m-0">{displayTiming}</InfoBubble></Col>
                      <Col size={6}><InfoBubble icon={spaceIcon} title={spaceTitle} className="joinRight h-100 m-0">{spaceText}</InfoBubble></Col>
                    </Row>

                    {hasNotes && (
                      <InfoBubble icon="room_service" title="Specific Details" className="full m-0 mb-2">
                        <div className="text-start">
                          {item.breakfastType && Array.isArray(item.breakfastType) && <p className="mb-1" style={{ fontSize: "0.95rem" }}><strong>Choices:</strong> {item.breakfastType.join(", ")}</p>}
                          {item.menu && <p className="mb-1" style={{ fontSize: "0.95rem" }}><strong>Menu:</strong> {item.menu}</p>}
                          {item.foodItems && item.foodItems !== "None" && <p className="mb-1" style={{ fontSize: "0.95rem" }}><strong>Food:</strong> {item.foodItems}</p>}
                          {item.drinkItems && item.drinkItems !== "None" && <p className="mb-1" style={{ fontSize: "0.95rem" }}><strong>Drinks:</strong> {item.drinkItems}</p>}

                          {/* Unified Notes Output */}
                          {(item.additionalNotes || item.tellUs) && <p className="mb-1" style={{ fontSize: "0.95rem" }}><strong>Notes:</strong> {item.additionalNotes || item.tellUs}</p>}

                          {item.allergens && item.allergens !== "None" && item.allergens !== "No" && (
                            <span className="text-danger fw-bold d-flex align-items-center mt-2" style={{ fontSize: "0.95rem" }}>
                              <span className="material-symbols-rounded me-1" style={{ fontSize: "18px" }}>warning</span> ALLERGIES: {item.allergens}
                            </span>
                          )}
                        </div>
                      </InfoBubble>
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-2 pt-2">
                      <button className="btn btn-link text-danger p-0 d-flex align-items-center" style={{ textDecoration: "none", fontSize: "0.85rem", opacity: 0.8 }} onClick={() => setItemToDelete(item.id)}>
                        <span className="material-symbols-rounded" style={{ fontSize: "18px", marginRight: "4px" }}>delete</span> Delete
                      </button>

                      <div className="d-flex gap-2">
                        {(!item.status || item.status === "pending") && (
                          <>
                            <RippleButton className="navButtonInactive m-0" style={{ height: "36px", padding: "0 16px", borderRadius: "18px", backgroundColor: "var(--errorContainer)", color: "var(--onErrorContainer)", display: "flex", alignItems: "center", gap: "4px" }} onClick={() => handleUpdateStatus(item.id, "denied")}>
                              <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>close</span> <span className="fw-bold" style={{ fontSize: "13px" }}>Deny</span>
                            </RippleButton>
                            <RippleButton className="navButton m-0" style={{ height: "36px", padding: "0 16px", borderRadius: "18px", backgroundColor: "var(--tertiary)", color: "var(--onTertiary)", display: "flex", alignItems: "center", gap: "4px" }} onClick={() => handleUpdateStatus(item.id, "approved")}>
                              <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>check</span> <span className="fw-bold" style={{ fontSize: "13px" }}>Approve</span>
                            </RippleButton>
                          </>
                        )}
                        {item.status === "approved" && (
                          <RippleButton className="navButton m-0" style={{ height: "36px", padding: "0 16px", borderRadius: "18px", display: "flex", alignItems: "center", gap: "4px" }} onClick={() => handleUpdateStatus(item.id, "completed")}>
                            <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>done_all</span> <span className="fw-bold" style={{ fontSize: "13px" }}>Complete</span>
                          </RippleButton>
                        )}
                      </div>
                    </div>

                  </Card>
                );
              })
            )}
          </Col>
        </Row>
      </main>

      <Modal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} appName="staff portal" title="Delete Record" color="var(--error)">
        <p className="text-start mb-4" style={{ fontSize: "1.1rem" }}>Are you sure you want to permanently delete this record? This action cannot be undone.</p>
        <div className="d-flex gap-2 mt-4">
          <RippleButton className="metro-list-btn m-0" style={{ backgroundColor: "var(--secondaryContainer)", color: "var(--onSecondaryContainer)", flex: 1, padding: "12px" }} onClick={() => setItemToDelete(null)}>
            <span className="button-text">Cancel</span>
          </RippleButton>
          <RippleButton className="metro-list-btn m-0" style={{ backgroundColor: "var(--error)", color: "var(--onError)", flex: 1, padding: "12px" }} onClick={confirmDelete}>
            <span className="material-symbols-rounded">delete_forever</span> <span className="button-text">Delete</span>
          </RippleButton>
        </div>
      </Modal>
    </>
  );
}
