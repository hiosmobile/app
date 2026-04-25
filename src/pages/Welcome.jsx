import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  ProgressWidget,
  MenuActionBtn,
  PageHeader,
  RippleButton,
  Row,
  Col,
  Modal,
  Switch, // Re-using your switch for the settings modal
} from "../../components/HiMaterial";
import {
  RewardsCodeWidget,
  DateWidget,
  WeatherWidget,
  QuickActionsWidget,
} from "../../components/Widgets";
import frameImg from "../assets/media/frame.png";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Define all possible widgets
const WIDGET_REGISTRY = {
  rewardsCode: {
    id: "rewardsCode",
    label: "Rewards QR Code",
    icon: "qr_code_2",
  },
  progress: { id: "progress", label: "Rewards Progress", icon: "donut_large" },
  weather: { id: "weather", label: "Local Weather", icon: "partly_cloudy_day" },
  calendar: { id: "calendar", label: "Calendar", icon: "calendar_month" },
  quickActions: { id: "quickActions", label: "Quick Actions", icon: "bolt" },
};

const DEFAULT_LAYOUT = {
  left: ["rewardsCode", "progress"],
  right: ["weather", "calendar", "quickActions"],
};

// =========================================
// MAIN HOME COMPONENT
// =========================================
export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // 1. Instantly load from localStorage to prevent the visual delay
  const [layout, setLayout] = useState(() => {
    const cached = localStorage.getItem("hiosDashboardLayout");
    return cached ? JSON.parse(cached) : DEFAULT_LAYOUT;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [addModalTarget, setAddModalTarget] = useState(null); // 'left' or 'right'

  const name = currentUser?.displayName?.split(" ")[0] || "HiOS User";
  const membershipCode = currentUser?.uid
    ? currentUser.uid.slice(0, 10).toUpperCase()
    : "490020-384380-3842992-9";

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good Morning";
    if (hrs <= 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getMessage = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Have a good day ahead.";
    if (hrs <= 17) return "Hope you have a nice afternoon.";
    return "Have a nice night.";
  };

  // 2. Silently sync from Firebase in the background
  useEffect(() => {
    const fetchDashboard = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(docRef);
          if (snap.exists() && snap.data().dashboardLayout) {
            const cloudLayout = snap.data().dashboardLayout;
            setLayout(cloudLayout);
            localStorage.setItem(
              "hiosDashboardLayout",
              JSON.stringify(cloudLayout),
            );
          }
        } catch (error) {
          console.error("Failed to load dashboard config:", error);
        }
      }
    };
    fetchDashboard();
  }, [currentUser]);

  // 3. Save to both local storage (instant) and Firebase (permanent)
  const saveLayout = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem("hiosDashboardLayout", JSON.stringify(newLayout));
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      setDoc(docRef, { dashboardLayout: newLayout }, { merge: true }).catch(
        (err) => console.error("Failed to save dashboard config:", err),
      );
    }
  };

  // --- Edit Mode Functions ---
  const moveUp = (colName, index) => {
    if (index === 0) return;
    const newLayout = { left: [...layout.left], right: [...layout.right] };
    const arr = newLayout[colName];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    saveLayout(newLayout);
  };

  const moveDown = (colName, index) => {
    const newLayout = { left: [...layout.left], right: [...layout.right] };
    const arr = newLayout[colName];
    if (index === arr.length - 1) return;
    [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
    saveLayout(newLayout);
  };

  const moveToOtherColumn = (colName, index) => {
    const newLayout = { left: [...layout.left], right: [...layout.right] };
    const targetCol = colName === "left" ? "right" : "left";
    const [item] = newLayout[colName].splice(index, 1);
    newLayout[targetCol].push(item);
    saveLayout(newLayout);
  };

  const removeWidget = (colName, index) => {
    const newLayout = { left: [...layout.left], right: [...layout.right] };
    newLayout[colName].splice(index, 1);
    saveLayout(newLayout);
  };

  const addWidget = (idToAdd) => {
    if (!addModalTarget) return;
    const newLayout = { left: [...layout.left], right: [...layout.right] };
    newLayout[addModalTarget].push(idToAdd);
    saveLayout(newLayout);
    setAddModalTarget(null);
  };

  // Find unused widgets for the Add Modal
  const usedWidgets = [...layout.left, ...layout.right];
  const availableToAdd = Object.values(WIDGET_REGISTRY).filter(
    (w) => !usedWidgets.includes(w.id),
  );

  // --- Widget Render Map ---
  const renderWidgetContent = (id) => {
    switch (id) {
      case "rewardsCode":
        return <RewardsCodeWidget code={membershipCode} imageSrc={frameImg} />;

      case "progress":
        return (
          <Card title="Your rewards, at a glance">
            <Row className="g-1 mt-2">
              <Col size={6}>
                <ProgressWidget
                  icon="local_cafe"
                  title="HiCafe™ Rewards"
                  current={4}
                  max={10}
                  subtitle="6 away from a free coffee"
                  className="joinLeft"
                />
              </Col>
              <Col size={6}>
                <ProgressWidget
                  icon="hotel"
                  title="weB&B Stays"
                  current={6}
                  max={20}
                  subtitle="14 away from a free night"
                  className="joinRight"
                />
              </Col>
            </Row>
          </Card>
        );

      case "weather":
        return (
          <Card title="Weather">
            <Row className="g-2 mt-2">
              <Col size={12}>
                <WeatherWidget />
              </Col>
            </Row>
          </Card>
        );

      case "calendar":
        return (
          <Card title="Calendar">
            <Row className="g-2 mt-2">
              <Col size={12}>
                <DateWidget />
              </Col>
            </Row>
          </Card>
        );

      case "quickActions":
        return (
          <QuickActionsWidget isEditing={isEditing} currentUser={currentUser} />
        );

      default:
        return null;
    }
  };

  const renderColumn = (colName) => {
    return (
      <Col size={12} md={6}>
        {/* Add Button for this specific column */}
        {isEditing && (
          <RippleButton
            className="button full mb-3 d-flex align-items-center justify-content-center"
            style={{
              border: "2px dashed var(--primary)",
              backgroundColor: "transparent",
              color: "var(--primary)",
            }}
            onClick={() => setAddModalTarget(colName)}
          >
            <span className="material-symbols-rounded me-2">add_circle</span>
            Add to this column
          </RippleButton>
        )}

        {layout[colName].map((widgetId, index) => (
          <div key={widgetId} className={index > 0 && !isEditing ? "mt-2" : ""}>
            {/* Edit Controls */}
            {isEditing && (
              <div
                className="d-flex justify-content-between align-items-center mb-1 px-2 py-1 mt-3"
                style={{
                  backgroundColor: "var(--secondaryContainer)",
                  borderRadius: "var(--radius-card)",
                  color: "var(--onSecondaryContainer)",
                }}
              >
                <span className="fw-bold ms-2" style={{ fontSize: "0.85rem" }}>
                  {WIDGET_REGISTRY[widgetId]?.label}
                </span>
                <div className="d-flex gap-1">
                  <button
                    className="nav-icon-btn p-1"
                    onClick={() => moveUp(colName, index)}
                    disabled={index === 0}
                    style={{ opacity: index === 0 ? 0.3 : 1 }}
                  >
                    <span className="material-symbols-rounded fs-5">
                      arrow_upward
                    </span>
                  </button>
                  <button
                    className="nav-icon-btn p-1"
                    onClick={() => moveDown(colName, index)}
                    disabled={index === layout[colName].length - 1}
                    style={{
                      opacity: index === layout[colName].length - 1 ? 0.3 : 1,
                    }}
                  >
                    <span className="material-symbols-rounded fs-5">
                      arrow_downward
                    </span>
                  </button>
                  <button
                    className="nav-icon-btn p-1"
                    onClick={() => moveToOtherColumn(colName, index)}
                  >
                    <span className="material-symbols-rounded fs-5">
                      swap_horiz
                    </span>
                  </button>
                  <button
                    className="nav-icon-btn p-1 text-danger"
                    onClick={() => removeWidget(colName, index)}
                  >
                    <span className="material-symbols-rounded fs-5">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Widget Itself */}
            <div style={{ transition: "opacity 0.2s" }}>
              {renderWidgetContent(widgetId)}
            </div>
          </div>
        ))}
      </Col>
    );
  };

  return (
    <>
      <main className="container mt-4 mb-5">
        {/* Header Row with Edit Toggle */}
        <Row className="mb-2">
          <Col size={12}>
            <Card bodyClass="text-start d-flex justify-content-between align-items-center p-3">
              <div>
                <p
                  className="gradientHeading mb-0"
                  style={{ fontSize: "2rem" }}
                >
                  <b>
                    {getGreeting()}, {name}!
                  </b>
                </p>
                <p
                  className="gradientHeadingSmall mb-0"
                  style={{ fontSize: "1.2rem", opacity: 0.8 }}
                >
                  {getMessage()}
                </p>
              </div>

              <RippleButton
                className="nav-icon-btn"
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  backgroundColor: isEditing ? "var(--primary)" : "transparent",
                  color: isEditing ? "var(--onPrimary)" : "var(--primary)",
                  border: "none",
                  width: "50px",
                  height: "50px",
                }}
              >
                <span className="material-symbols-rounded">
                  {isEditing ? "check" : "edit"}
                </span>
              </RippleButton>
            </Card>
          </Col>
        </Row>

        {/* Dynamic Staggered Grid */}
        <Row className="g-2">
          {renderColumn("left")}
          {renderColumn("right")}
        </Row>
      </main>

      {/* Add Widget Modal */}
      <Modal isOpen={!!addModalTarget} title="Add Widget">
        <p className="text-start mb-3">
          Select a widget to add to the dashboard.
        </p>

        {availableToAdd.length === 0 ? (
          <div className="p-4 text-center" style={{ opacity: 0.6 }}>
            <span className="material-symbols-rounded fs-1 mb-2">
              dashboard_customize
            </span>
            <p>You have already added all available widgets!</p>
          </div>
        ) : (
          <div className="d-flex flex-column">
            {" "}
            {/* Removed gap-1 to fix spacing */}
            {availableToAdd.map((widget, index) => {
              const isFirst = index === 0;
              const isLast = index === availableToAdd.length - 1;
              const joinClass =
                isFirst && isLast
                  ? "full"
                  : isFirst
                    ? "joinTop"
                    : isLast
                      ? "joinBottom"
                      : "joinMiddle";

              return (
                <MenuActionBtn
                  key={widget.id}
                  icon={widget.icon}
                  text={widget.label}
                  className={joinClass}
                  onClick={() => addWidget(widget.id)}
                />
              );
            })}
          </div>
        )}

        <div className="mt-4">
          <button
            type="button"
            className="navButtonInactive w-100"
            onClick={() => setAddModalTarget(null)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}
