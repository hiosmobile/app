import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  MenuActionBtn,
  RippleButton,
  Row,
  Col,
  Modal,
} from "../../components/HiMaterial";
import {
  RewardsCodeWidget,
  DateWidget,
  WeatherWidget,
  QuickActionsWidget,
  ProgressWidget
} from "../../components/Widgets";
import frameImg from "../assets/media/frame.png";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const WIDGET_REGISTRY = {
  rewardsCode: {
    id: "rewardsCode",
    label: "Your Code",
    icon: "qr_code_2",
    appName: "Rewards",
  },
  progress: { id: "progress", label: "Rewards Progress", icon: "donut_large" },
  weather: {
    id: "weather",
    label: "weather",
    icon: "partly_cloudy_day",
    color: "var(--primary)",
    appName: "weather",
  },
  calendar: {
    id: "calendar",
    label: "calendar",
    icon: "calendar_month",
    color: "var(--primary)",
    appName: "schedule",
  },
  quickActions: { id: "quickActions", label: "Quick Actions", icon: "bolt" },
};

const DEFAULT_LAYOUT = {
  left: ["rewardsCode", "progress"],
  right: ["weather", "calendar", "quickActions"],
};

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [layout, setLayout] = useState(() => {
    const cached = localStorage.getItem("hiosDashboardLayout");
    return cached ? JSON.parse(cached) : DEFAULT_LAYOUT;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [addModalTarget, setAddModalTarget] = useState(null);
  const [activeApp, setActiveApp] = useState(null);

  const name = currentUser?.displayName?.split(" ")[0] || "Harmony User";
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

  const openApp = (id) => {
    if (!isEditing) setActiveApp(id);
  };

  const closeApp = () => {
    setActiveApp(null);
  };

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
              JSON.stringify(cloudLayout)
            );
          }
        } catch (error) {
          console.error("Failed to load dashboard config:", error);
        }
      }
    };
    fetchDashboard();
  }, [currentUser]);

  const saveLayout = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem("hiosDashboardLayout", JSON.stringify(newLayout));
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      setDoc(docRef, { dashboardLayout: newLayout }, { merge: true }).catch(
        (err) => console.error("Failed to save dashboard config:", err)
      );
    }
  };

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

  const usedWidgets = [...layout.left, ...layout.right];
  const availableToAdd = Object.values(WIDGET_REGISTRY).filter(
    (w) => !usedWidgets.includes(w.id)
  );

  const renderWidgetContent = (id, combinedClass) => {
      switch (id) {
        case "rewardsCode":
          return (
            <div
              className="m-0 p-0"
              onClick={() => openApp("rewardsCode")}
              style={{ cursor: isEditing ? "default" : "pointer" }}
            >
              <RewardsCodeWidget
                code={membershipCode}
                imageSrc={frameImg}
                className={combinedClass}
              />
            </div>
          );

        case "progress":
          return <ProgressWidget className={combinedClass} />;

        case "weather":
          return (
            <div
              className="m-0 p-0"
              onClick={() => openApp("weather")}
              style={{ cursor: isEditing ? "default" : "pointer" }}
            >
              <Card className={`${combinedClass} h-100 border-0`} bodyClass="p-0 h-100 border-0">
                <WeatherWidget isExpanded={false} />
              </Card>
            </div>
          );

        case "calendar":
          return (
            <div
              className="m-0 p-0"
              onClick={() => openApp("calendar")}
              style={{ cursor: isEditing ? "default" : "pointer" }}
            >
              <Card className={`${combinedClass} h-100 border-0`} bodyClass="p-0 h-100 border-0">
                <DateWidget isExpanded={false} />
              </Card>
            </div>
          );

        case "quickActions":
          return (
            <QuickActionsWidget
              isEditing={isEditing}
              currentUser={currentUser}
              className={combinedClass}
            />
          );

        default:
          return null;
      }
    };

  const renderColumn = (colName) => {
    const baseDelay = colName === "left" ? 2 : layout.left.length + 2;
    const totalItems = layout[colName].length;

    return (
      <Col size={12} md={6}>
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

        {layout[colName].map((widgetId, index) => {
          const delayNum = baseDelay + index;
          const animClass = !isEditing
            ? `metro-anim-list-item delay-${delayNum}`
            : "";

          let joinClass = "full";
          if (!isEditing && totalItems > 0) {
            if (colName === "left") {
                if (totalItems === 1) {
                    joinClass = "joinBottomLeft";
                } else {
                    if (index === 0) joinClass = "joinMiddle";
                    else if (index === totalItems - 1) joinClass = "joinBottomLeft";
                    else joinClass = "joinMiddle";
                }
            } else {
                if (totalItems === 1) {
                    joinClass = "joinBottomRight";
                } else {
                    if (index === 0) joinClass = "rightColJoinTop";
                    else if (index === totalItems - 1) joinClass = "joinBottomRight";
                    else joinClass = "joinMiddle";
                }
            }
          }

          // mt-0 overrides internal margins set by individual widgets
          const combinedClass = `${animClass} ${joinClass} mt-0`.trim();

          return (
            <div key={widgetId}>
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
              <div style={{ transition: "opacity 0.2s" }}>
                {renderWidgetContent(widgetId, combinedClass)}
              </div>
            </div>
          );
        })}
      </Col>
    );
  };

  const activeAppData = WIDGET_REGISTRY[activeApp];

  return (
    <>
      <main className="container mt-4 mb-5">
        <Row>
          <Col size={12}>
            <Card
              className={`metro-anim-list-item delay-1 ${!isEditing ? "joinTop pb-3" : "full pb-3"}`}
              bodyClass="d-flex justify-content-between align-items-center"
            >
              <div className="top-container m-0 text-start" style={{ minWidth: "auto", flex: 1 }}>
                {/* Uses standard PageHeader formatting: blue-h2 without bold overrides */}
                <h1 className="blue-h2 mb-0">
                  {getGreeting()}, {name}!
                </h1>
                {/* Uses standard PageHeader formatting: subtitle class and id="para" */}
                <p id="para" className="subtitle mb-0 mt-0">
                  {getMessage()}
                </p>
              </div>

              <RippleButton
                className="nav-icon-btn metro-tile-btn ms-3 flex-shrink-0"
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  backgroundColor: isEditing
                    ? "var(--primary)"
                    : "color-mix(in srgb, var(--surface) 30%, transparent)",
                  color: isEditing
                    ? "var(--onPrimary)"
                    : "var(--onSurface)",
                  border: "0.5px solid var(--outline)",
                  width: "50px",
                  height: "50px",
                }}
              >
                <span className="material-symbols-rounded">
                  {isEditing ? "check" : "edit_square"}
                </span>
              </RippleButton>
            </Card>
          </Col>
        </Row>


        <Row className="g-1">
          {renderColumn("left")}
          {renderColumn("right")}
        </Row>
      </main>

      <Modal
        isOpen={!!addModalTarget}
        onClose={() => setAddModalTarget(null)}
        appName="dashboard"
        title="add widget"
        color="var(--primary)"
      >
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
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "24px",
          }}
        >
          <button
            type="button"
            className="button"
            style={{
              width: "auto",
              height: "auto",
              margin: 0,
              backgroundColor: "transparent",
              border: "none",
              color: "var(--onBackground)",
            }}
            onClick={() => setAddModalTarget(null)}
          >
            cancel
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={!!activeApp}
        onClose={closeApp}
        appName={activeAppData?.appName}
        title={activeAppData?.label}
        color={activeAppData?.color || "var(--subtext)"}
      >
        {activeApp === "weather" && <WeatherWidget isExpanded={true} />}
        {activeApp === "calendar" && <DateWidget isExpanded={false} />}
        {activeApp === "rewardsCode" && <RewardsCodeWidget code={membershipCode} imageSrc={frameImg} />}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "30px",
          }}
        >
          <button
            className="button"
            style={{
              width: "auto",
              height: "auto",
              margin: 0,
              backgroundColor: "transparent",
              border: "none",
              color: "var(--onBackground)",
            }}
            onClick={closeApp}
          >
            close
          </button>
        </div>
      </Modal>
    </>
  );
}
