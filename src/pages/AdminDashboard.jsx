import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; 
import { Card, PageHeader, Row, Col, RippleButton, SubNavPills, Dropdown, InfoBubble, Modal } from "../../components/HiMaterial"; 
import { useAuth } from "../AuthContext"; 

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("restaurant_bookings");
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [showHidden, setShowHidden] = useState(false); 
  
  // New state to manage the custom delete modal
  const [itemToDelete, setItemToDelete] = useState(null);

  const ADMIN_EMAIL = "jefaar80@gmail.com";

  const tabs = [
    { id: "restaurant_bookings", label: "Table Bookings" },
    { id: "restaurant_orders", label: "Food Orders" },
    { id: "breakfast_checkin", label: "Breakfast Check-in" },
    { id: "hotel_bookings", label: "Hotel Bookings" },
    { id: "hotel_checkin", label: "Hotel Check-in" },
    { id: "hotel_checkout", label: "Hotel Check-out" }
  ];

  useEffect(() => {
    setLocationFilter("All Locations");
  }, [activeTab]);

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
      console.error("Failed to update status: ", err);
      alert("Network error. Could not update status.");
    }
  };

  // Opens the custom modal instead of a browser popup
  const handleDeleteClick = (docId) => {
    setItemToDelete(docId);
  };

  // Executes the deletion when confirmed inside the modal
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, activeTab, itemToDelete));
      setItemToDelete(null); // Close modal on success
    } catch (err) {
      console.error("Failed to delete record: ", err);
      alert("Network error. Could not delete record.");
      setItemToDelete(null);
    }
  };

  if (currentUser?.email !== ADMIN_EMAIL) {
    return (
      <main className="container mt-4 mb-5">
        <Row>
          <Col size={12}>
            <Card className="text-center p-5 joinTop" bodyClass="d-flex flex-column align-items-center">
              <span className="material-symbols-rounded fs-1 text-danger mb-3">gpp_bad</span>
              <h3 className="blue-h2" style={{ fontSize: "1.5rem" }}>access denied</h3>
              <p className="opacity-75">You do not have permission to view the staff portal.</p>
              <RippleButton className="form-button mt-4" onClick={() => navigate("/")} style={{ maxWidth: "200px" }}>
                Return to Home
              </RippleButton>
            </Card>
          </Col>
        </Row>
      </main>
    );
  }

  const uniqueLocations = ["All Locations", ...new Set(dataList.map(item => item.restaurant || item.location).filter(Boolean))];
  const locationOptions = uniqueLocations.map(loc => ({ label: loc, value: loc }));

  const filteredList = dataList.filter(item => {
    const matchesLocation = locationFilter === "All Locations" || (item.restaurant || item.location) === locationFilter;
    const isCompletedOrDenied = item.status === "completed" || item.status === "denied";
    const matchesStatus = showHidden ? true : !isCompletedOrDenied;
    return matchesLocation && matchesStatus;
  });

  const getBadgeColors = (status) => {
    switch(status) {
      case "approved": return { bg: "var(--tertiaryContainer)", text: "var(--onTertiaryContainer)" };
      case "completed": return { bg: "var(--primaryContainer)", text: "var(--onPrimaryContainer)" };
      case "denied": return { bg: "var(--errorContainer)", text: "var(--onErrorContainer)" };
      case "pending":
      default: return { bg: "var(--secondaryContainer)", text: "var(--onSecondaryContainer)" };
    }
  };

  return (
    <>
      <main className="container mt-4 mb-5">
        <Row>
          <Col size={12}>
            <PageHeader
              title="Staff Portal"
              subtitle="Manage incoming requests and orders."
              className="joinTop pb-3 metro-anim-list-item delay-1"
            />
          </Col>
        </Row>

        <Row>
          <Col size={12}>
            <Card className="joinMiddle metro-anim-list-item delay-2" bodyClass="p-2">
              <SubNavPills tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            </Card>
          </Col>
        </Row>

        <Row>
          <Col size={12}>
            <Card className="joinMiddle metro-anim-list-item delay-3" bodyClass="p-2 d-flex gap-2">
              <div className="flex-grow-1">
                <Dropdown 
                  options={locationOptions} 
                  value={locationFilter} 
                  onChange={(val) => setLocationFilter(val)} 
                  className="mb-0" 
                  disabled={dataList.length === 0}
                  style={{ margin: 0 }}
                />
              </div>
              <RippleButton 
                className={showHidden ? "navButton" : "navButtonInactive"}
                style={{ 
                  width: "64px", 
                  height: "64px", 
                  margin: 0, 
                  borderRadius: "var(--radius-card)", 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  backgroundColor: showHidden ? "var(--primary)" : "var(--secondaryContainer)", 
                  color: showHidden ? "var(--onPrimary)" : "var(--onSecondaryContainer)" 
                }}
                onClick={() => setShowHidden(!showHidden)}
                title={showHidden ? "Hide completed" : "Show all"}
              >
                <span className="material-symbols-rounded" style={{ margin: 0, fontSize: "24px" }}>
                  {showHidden ? "visibility" : "visibility_off"}
                </span>
              </RippleButton>
            </Card>
          </Col>
        </Row>

        <Row className="g-1">
          <Col size={12}>
            {loading ? (
              <Card className="text-center p-4 full">
                <p>Loading records...</p>
              </Card>
            ) : filteredList.length === 0 ? (
              <Card className="text-center p-4 joinBottom metro-anim-list-item delay-4">
                <span className="material-symbols-rounded fs-1 opacity-50 mb-2">inbox</span>
                <p>No active records found.</p>
              </Card>
            ) : (
              filteredList.map((item, index) => {
                const isLast = index === filteredList.length - 1;
                const joinClass = isLast ? "joinBottom" : "joinMiddle";
                
                const badgeStyle = getBadgeColors(item.status);
                const delayNum = Math.min(index + 4, 10);

                const displayDate = item.dateBooked || (item.createdAt ? new Date(item.createdAt.toDate()).toLocaleDateString() : "N/A");
                const displayTime = item.timeBooked ? ` at ${item.timeBooked}` : "";

                return (
                  <Card key={item.id} className={`${joinClass} text-start metro-anim-list-item delay-${delayNum}`} bodyClass="p-3">
                    
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h2 className="blue-h3 m-0" style={{ fontSize: "1.5rem" }}>
                          {item.lastName || item.customerName || "Submission"}
                        </h2>
                        <p className="mb-0 opacity-75 fw-bold" style={{ fontSize: "0.9rem" }}>
                          {item.restaurant || item.location || activeTab.replace("_", " ")}
                        </p>
                      </div>
                      <span 
                        className="badge px-3 py-2 rounded-pill fw-bold mt-1" 
                        style={{ 
                          backgroundColor: badgeStyle.bg,
                          color: badgeStyle.text,
                          border: `1px solid ${badgeStyle.text}`,
                          fontSize: "0.85rem",
                          textTransform: "lowercase"
                        }}
                      >
                        {item.status}
                      </span>
                    </div>

                    <Row className="g-1 mb-1">
                      <Col size={6}>
                        <InfoBubble icon="schedule" title="Timing" className="joinLeft h-100 m-0">
                          {displayDate}{displayTime}
                        </InfoBubble>
                      </Col>
                      <Col size={6}>
                        <InfoBubble 
                          icon={item.tableNumber ? "table_restaurant" : "mail"} 
                          title={item.tableNumber ? "Table & Guests" : "Contact Email"} 
                          className="joinRight h-100 m-0"
                        >
                          {item.tableNumber ? `Table ${item.tableNumber} (${item.peopleCount ? `${item.peopleCount} pax` : "Size unknown"})` : (item.email || "No email")}
                        </InfoBubble>
                      </Col>
                    </Row>

                    {(item.foodItems || item.drinkItems || item.menu || item.additionalNotes || (item.allergens && item.allergens !== "No")) && (
                      <InfoBubble icon="room_service" title="Order Details" className="full m-0 mb-2">
                        <div className="text-start">
                          {item.menu && <p className="mb-1" style={{ fontSize: "0.95rem" }}><strong>Menu:</strong> {item.menu}</p>}
                          {item.foodItems && item.foodItems !== "None" && <p className="mb-1" style={{ fontSize: "0.95rem" }}><strong>Food:</strong> {item.foodItems}</p>}
                          {item.drinkItems && item.drinkItems !== "None" && <p className="mb-1" style={{ fontSize: "0.95rem" }}><strong>Drinks:</strong> {item.drinkItems}</p>}
                          {item.additionalNotes && <p className="mb-1" style={{ fontSize: "0.95rem" }}><strong>Notes:</strong> {item.additionalNotes}</p>}
                          
                          {item.allergens && item.allergens !== "None" && item.allergens !== "No" && (
                            <span className="text-danger fw-bold d-flex align-items-center mt-2" style={{ fontSize: "0.95rem" }}>
                              <span className="material-symbols-rounded me-1" style={{ fontSize: "18px" }}>warning</span>
                              ALLERGIES: {item.allergens}
                            </span>
                          )}
                        </div>
                      </InfoBubble>
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                      <button 
                        className="btn btn-link text-danger p-0 d-flex align-items-center" 
                        style={{ textDecoration: "none", fontSize: "0.85rem", opacity: 0.8 }}
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        <span className="material-symbols-rounded" style={{ fontSize: "18px", marginRight: "4px" }}>delete</span>
                        Delete
                      </button>

                      <div className="d-flex gap-2">
                        {item.status === "pending" && (
                          <>
                            <RippleButton 
                              className="navButtonInactive m-0" 
                              style={{ height: "36px", padding: "0 16px", borderRadius: "18px", backgroundColor: "var(--errorContainer)", color: "var(--onErrorContainer)", display: "flex", alignItems: "center", gap: "4px" }}
                              onClick={() => handleUpdateStatus(item.id, "denied")}
                            >
                              <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>close</span>
                              <span className="fw-bold" style={{ fontSize: "13px" }}>Deny</span>
                            </RippleButton>
                            <RippleButton 
                              className="navButton m-0" 
                              style={{ height: "36px", padding: "0 16px", borderRadius: "18px", backgroundColor: "var(--tertiary)", color: "var(--onTertiary)", display: "flex", alignItems: "center", gap: "4px" }}
                              onClick={() => handleUpdateStatus(item.id, "approved")}
                            >
                              <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>check</span>
                              <span className="fw-bold" style={{ fontSize: "13px" }}>Approve</span>
                            </RippleButton>
                          </>
                        )}
                        {item.status === "approved" && (
                          <RippleButton 
                            className="navButton m-0" 
                            style={{ height: "36px", padding: "0 16px", borderRadius: "18px", display: "flex", alignItems: "center", gap: "4px" }}
                            onClick={() => handleUpdateStatus(item.id, "completed")}
                          >
                            <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>done_all</span>
                            <span className="fw-bold" style={{ fontSize: "13px" }}>Mark Completed</span>
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

      {/* HiMaterial Custom Delete Confirmation Modal */}
      <Modal 
        isOpen={!!itemToDelete} 
        onClose={() => setItemToDelete(null)} 
        appName="staff portal" 
        title="Delete Record"
        color="var(--error)"
      >
        <p className="text-start mb-4" style={{ fontSize: "1.1rem" }}>
          Are you sure you want to permanently delete this record? This action cannot be undone.
        </p>
        
        <div className="d-flex gap-2 mt-4">
          <RippleButton 
            className="metro-list-btn m-0" 
            style={{ backgroundColor: "var(--secondaryContainer)", color: "var(--onSecondaryContainer)", flex: 1, padding: "12px" }}
            onClick={() => setItemToDelete(null)}
          >
            <span className="button-text">Cancel</span>
          </RippleButton>
          
          <RippleButton 
            className="metro-list-btn m-0" 
            style={{ backgroundColor: "var(--error)", color: "var(--onError)", flex: 1, padding: "12px" }}
            onClick={confirmDelete}
          >
            <span className="material-symbols-rounded">delete_forever</span>
            <span className="button-text">Delete</span>
          </RippleButton>
        </div>
      </Modal>
    </>
  );
}