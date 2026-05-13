import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Switch, MenuActionBtn } from "../../components/HiMaterial"; // Using the Metro versions we built

const WIDGET_REGISTRY = {
  rewardsCode: {
    id: "rewardsCode",
    label: "rewards qr",
    color: "var(--metro-magenta)",
    appName: "hirewards",
  },
  progress: {
    id: "progress",
    label: "progress",
    color: "var(--metro-red)",
    appName: "hirewards",
  },
  weather: {
    id: "weather",
    label: "weather",
    color: "var(--metro-cyan)",
    appName: "weather",
  },
  calendar: {
    id: "calendar",
    label: "calendar",
    color: "var(--metro-green)",
    appName: "calendar",
  },
  quickActions: {
    id: "quickActions",
    label: "shortcuts",
    color: "var(--metro-mango)",
    appName: "settings",
  },
};

const DEFAULT_LAYOUT = [
  "rewardsCode",
  "progress",
  "weather",
  "calendar",
  "quickActions",
];

const APP_PAGES = [
  { id: "restaurant", label: "eat", icon: "restaurant", path: "/restaurant" },
  {
    id: "hicafe",
    label: "hicafe™",
    icon: "local_cafe",
    path: "/restaurant/hicafe",
  },
  {
    id: "breakfast",
    label: "breakfast",
    icon: "bakery_dining",
    path: "/restaurant/breakfast",
  },
  {
    id: "cafefiesta",
    label: "cafe fiesta",
    icon: "local_pizza",
    path: "/restaurant/cafefiesta",
  },
  {
    id: "locations",
    label: "locations",
    icon: "location_on",
    path: "/restaurant/locations",
  },
  {
    id: "hotel",
    label: "hotel activities",
    icon: "pool",
    path: "/hotelactivities",
  },
  { id: "rewards", label: "hirewards", icon: "award_star", path: "/hirewards" },
];

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // --- CORE STATE ---
  const [layout, setLayout] = useState(() => {
    const cached = localStorage.getItem("hiosDashboardLayout");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.left || parsed.right)
          return [...(parsed.left || []), ...(parsed.right || [])];
        return Array.isArray(parsed) ? parsed : DEFAULT_LAYOUT;
      } catch {
        return DEFAULT_LAYOUT;
      }
    }
    return DEFAULT_LAYOUT;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeApp, setActiveApp] = useState(null);

  // --- WEATHER STATE ---
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState("Loading...");
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [isWeatherEditing, setIsWeatherEditing] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // --- CALENDAR STATE ---
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- QUICK ACTIONS STATE ---
  const [activeActions, setActiveActions] = useState(() => {
    const cached = localStorage.getItem("hiosQuickActions");
    return cached ? JSON.parse(cached) : ["hicafe", "hotel"];
  });
  const [isActionsEditing, setIsActionsEditing] = useState(false);

  const name = currentUser?.displayName?.split(" ")[0] || "User";
  const membershipCode = currentUser?.uid
    ? currentUser.uid.slice(0, 10).toUpperCase()
    : "490020-38";

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "good morning";
    if (hrs <= 17) return "good afternoon";
    return "good evening";
  };

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.dashboardLayout) {
              const cloudLayout = data.dashboardLayout;
              setLayout(
                cloudLayout.left || cloudLayout.right
                  ? [...(cloudLayout.left || []), ...(cloudLayout.right || [])]
                  : cloudLayout,
              );
            }
            if (data.quickActions) {
              setActiveActions(data.quickActions);
              localStorage.setItem(
                "hiosQuickActions",
                JSON.stringify(data.quickActions),
              );
            }
          }
        } catch (error) {
          console.error("Failed to load config:", error);
        }
      }
    };
    fetchData();

    // Init Weather
    const savedLocation = localStorage.getItem("hios_weather_pref");
    if (savedLocation) {
      const { lat, lon, name } = JSON.parse(savedLocation);
      fetchWeather(lat, lon, name);
    } else {
      fetchWeather(51.5085, -0.1257, "London, United Kingdom"); // Default fallback
    }
  }, [currentUser]);

  const saveLayout = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem("hiosDashboardLayout", JSON.stringify(newLayout));
    if (currentUser)
      setDoc(
        doc(db, "users", currentUser.uid),
        { dashboardLayout: newLayout },
        { merge: true },
      );
  };

  const openApp = (id) => {
    if (!isEditing) setActiveApp(id);
  };
  const closeApp = () => {
    setActiveApp(null);
    setIsWeatherEditing(false);
    setIsActionsEditing(false);
  };

  // --- WEATHER LOGIC ---
  const getWeatherDetails = (code, isDay) => {
    if (code === 0)
      return { icon: isDay ? "light_mode" : "dark_mode", text: "clear sky" };
    if (code >= 1 && code <= 3)
      return {
        icon: isDay ? "partly_cloudy_day" : "partly_cloudy_night",
        text: "partly cloudy",
      };
    if (code === 45 || code === 48) return { icon: "foggy", text: "fog" };
    if (code >= 51 && code <= 65) return { icon: "rainy", text: "rain" };
    if (code >= 71 && code <= 77)
      return { icon: "cloudy_snowing", text: "snow" };
    if (code >= 80 && code <= 82)
      return { icon: "rainy", text: "rain showers" };
    if (code >= 95 && code <= 99)
      return { icon: "thunderstorm", text: "thunderstorm" };
    return { icon: "cloud", text: "unknown" };
  };

  const fetchWeather = async (lat, lon, name) => {
    try {
      setIsWeatherLoading(true);
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
      );
      const data = await res.json();
      setWeather(data.current_weather);
      setLocationName(name);
    } catch (err) {
      console.error(err);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const handleWeatherSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchInput)}&format=json&limit=5`,
      );
      const data = await res.json();
      setSearchResults(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const selectLocation = async (lat, lon, displayName) => {
    const nameParts = displayName.split(", ");
    const shortName =
      nameParts.length > 1
        ? `${nameParts[0]}, ${nameParts[nameParts.length - 1]}`
        : nameParts[0];
    localStorage.setItem(
      "hios_weather_pref",
      JSON.stringify({ lat, lon, name: shortName }),
    );
    setSearchResults([]);
    setSearchInput("");
    setIsWeatherEditing(false);
    await fetchWeather(lat, lon, shortName);
  };

  // --- CALENDAR LOGIC ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const dayNames = ["su", "mo", "tu", "we", "th", "fr", "sa"];
  const calendarCells = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // --- QUICK ACTIONS LOGIC ---
  const toggleAction = (id) => {
    const newActions = activeActions.includes(id)
      ? activeActions.filter((a) => a !== id)
      : [...activeActions, id];
    setActiveActions(newActions);
    localStorage.setItem("hiosQuickActions", JSON.stringify(newActions));
    if (currentUser)
      setDoc(
        doc(db, "users", currentUser.uid),
        { quickActions: newActions },
        { merge: true },
      );
  };

  // --- MODAL POPUP RENDERER ---
  const renderModal = () => {
    if (!activeApp) return null;
    const data = WIDGET_REGISTRY[activeApp];

    return (
      <div className="metro-modal-overlay" onClick={closeApp}>
        <div
          className="metro-modal-content"
          onClick={(e) => e.stopPropagation()}
          style={{ borderTopColor: data?.color || "var(--subtext)" }}
        >
          {data && (
            <p className="wp7-app-title" style={{ color: data.color }}>
              {data.appName}
            </p>
          )}
          <h2
            className="wp7-app-header"
            style={{
              fontSize: "3rem",
              marginBottom: "20px",
              whiteSpace: "normal",
            }}
          >
            {data?.label || (activeApp === "addMenu" ? "pin to start" : "")}
          </h2>

          <div
            style={{
              color: "var(--onBackground)",
              fontSize: "1.2rem",
              fontWeight: 300,
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            {/* --- ADD MENU --- */}
            {activeApp === "addMenu" && (
              <div>
                <p style={{ marginBottom: "20px", color: "var(--subtext)" }}>
                  {availableToAdd.length === 0
                    ? "all apps are already pinned."
                    : "tap an app to pin it to your start screen."}
                </p>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {availableToAdd.map((widget) => (
                    <button
                      key={widget.id}
                      className="button"
                      onClick={() => {
                        saveLayout([...layout, widget.id]);
                        closeApp();
                      }}
                    >
                      {widget.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* --- REWARDS QR --- */}
            {activeApp === "rewardsCode" && (
              <div
                style={{
                  textAlign: "center",
                  background: "var(--onBackground)",
                  color: "var(--background)",
                  padding: "40px 20px",
                  margin: "20px 0",
                }}
              >
                <span
                  className="material-symbols-sharp"
                  style={{ fontSize: "160px" }}
                >
                  qr_code_2
                </span>
                <p
                  style={{
                    margin: 0,
                    fontWeight: "bold",
                    fontSize: "20px",
                    letterSpacing: "2px",
                  }}
                >
                  {membershipCode}
                </p>
              </div>
            )}

            {/* --- REWARDS PROGRESS --- */}
            {activeApp === "progress" && (
              <div>
                <p
                  style={{
                    fontSize: "4rem",
                    fontWeight: 200,
                    margin: "0 0 10px 0",
                    color: data.color,
                  }}
                >
                  4/10
                </p>
                <p>
                  stars collected. buy 6 more coffees to unlock a free reward.
                </p>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "var(--surface)",
                    marginTop: "20px",
                  }}
                >
                  <div
                    style={{
                      width: `40%`,
                      height: "100%",
                      backgroundColor: data.color,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* --- WEATHER EXPANDED --- */}
            {activeApp === "weather" && (
              <div>
                {isWeatherEditing ? (
                  <div>
                    <form
                      onSubmit={handleWeatherSearch}
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "20px",
                      }}
                    >
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="search city..."
                        style={{
                          flex: 1,
                          padding: "10px",
                          border: "2px solid var(--subtext)",
                          background: "transparent",
                          color: "var(--onBackground)",
                          textTransform: "lowercase",
                        }}
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="button"
                        style={{ width: "auto", margin: 0 }}
                      >
                        search
                      </button>
                    </form>
                    {searchResults.map((res) => (
                      <button
                        key={res.place_id}
                        onClick={() =>
                          selectLocation(res.lat, res.lon, res.display_name)
                        }
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "15px",
                          background: "transparent",
                          border: "none",
                          borderBottom: "1px solid var(--surface)",
                          color: "var(--onBackground)",
                          fontSize: "16px",
                          textTransform: "lowercase",
                        }}
                      >
                        {res.display_name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid var(--surface)",
                        paddingBottom: "10px",
                        marginBottom: "20px",
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: 600 }}>
                        {locationName.toLowerCase()}
                      </p>
                      <button
                        onClick={() => setIsWeatherEditing(true)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: data.color,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span className="material-symbols-sharp">
                          edit_location
                        </span>
                      </button>
                    </div>
                    {isWeatherLoading ? (
                      <p>loading weather...</p>
                    ) : weather ? (
                      <>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            marginBottom: "20px",
                          }}
                        >
                          <span
                            className="material-symbols-sharp"
                            style={{ fontSize: "80px", color: data.color }}
                          >
                            {
                              getWeatherDetails(
                                weather.weathercode,
                                weather.is_day,
                              ).icon
                            }
                          </span>
                          <h1
                            style={{
                              fontSize: "5rem",
                              fontWeight: 200,
                              margin: 0,
                            }}
                          >
                            {Math.round(weather.temperature)}°
                          </h1>
                        </div>
                        <p style={{ fontWeight: 600 }}>
                          {
                            getWeatherDetails(
                              weather.weathercode,
                              weather.is_day,
                            ).text
                          }
                        </p>
                        <p
                          style={{ color: "var(--subtext)", fontSize: "1rem" }}
                        >
                          wind speed: {weather.windspeed} km/h
                        </p>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            )}

            {/* --- CALENDAR EXPANDED --- */}
            {activeApp === "calendar" && (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <button
                    onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--onBackground)",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className="material-symbols-sharp"
                      style={{ fontSize: "32px" }}
                    >
                      chevron_left
                    </span>
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: data.color,
                      fontSize: "1.5rem",
                      fontWeight: "300",
                      textTransform: "lowercase",
                      cursor: "pointer",
                    }}
                  >
                    {monthNames[month]} {year}
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--onBackground)",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className="material-symbols-sharp"
                      style={{ fontSize: "32px" }}
                    >
                      chevron_right
                    </span>
                  </button>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "4px",
                    marginBottom: "8px",
                    textAlign: "center",
                    color: "var(--subtext)",
                    fontSize: "14px",
                  }}
                >
                  {dayNames.map((day) => (
                    <div key={day}>{day}</div>
                  ))}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "4px",
                  }}
                >
                  {calendarCells.map((day, idx) => {
                    const isToday =
                      day === new Date().getDate() &&
                      month === new Date().getMonth() &&
                      year === new Date().getFullYear();
                    return (
                      <div
                        key={idx}
                        style={{
                          aspectRatio: "1/1",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: isToday
                            ? data.color
                            : day
                              ? "var(--surface)"
                              : "transparent",
                          color: isToday ? "#fff" : "var(--onBackground)",
                          fontWeight: isToday ? "bold" : "normal",
                          fontSize: "18px",
                        }}
                      >
                        {day || ""}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- QUICK ACTIONS EXPANDED --- */}
            {activeApp === "quickActions" && (
              <div>
                {isActionsEditing ? (
                  <div>
                    <p
                      style={{ color: "var(--subtext)", marginBottom: "20px" }}
                    >
                      choose which apps appear in your shortcuts list.
                    </p>
                    {APP_PAGES.map((page) => (
                      <Switch
                        key={page.id}
                        label={page.label}
                        checked={activeActions.includes(page.id)}
                        onChange={() => toggleAction(page.id)}
                      />
                    ))}
                    <button
                      className="button mt-4"
                      onClick={() => setIsActionsEditing(false)}
                    >
                      done
                    </button>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        borderBottom: "1px solid var(--surface)",
                        paddingBottom: "10px",
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: 600 }}>
                        your pinned shortcuts
                      </p>
                      <button
                        onClick={() => setIsActionsEditing(true)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: data.color,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span className="material-symbols-sharp">edit</span>
                      </button>
                    </div>

                    {APP_PAGES.filter((p) => activeActions.includes(p.id))
                      .length === 0 ? (
                      <p style={{ color: "var(--subtext)" }}>
                        no shortcuts pinned.
                      </p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {APP_PAGES.filter((p) =>
                          activeActions.includes(p.id),
                        ).map((page) => (
                          <MenuActionBtn
                            key={page.id}
                            icon={page.icon}
                            text={page.label}
                            onClick={() => navigate(page.path)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
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
                margin: 0,
                backgroundColor: "transparent",
                border: "none",
              }}
              onClick={closeApp}
            >
              close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <main className={`container wp-screen wp-anim-in`}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--subtext)",
              cursor: "pointer",
            }}
          >
            <span
              className="material-symbols-sharp"
              style={{ fontSize: "28px" }}
            >
              {isEditing ? "check" : "edit"}
            </span>
          </button>
        </div>

        <div>
          <h1 className="metro-page-header">
            {getGreeting()},<br />
            {name.toLowerCase()}
          </h1>
        </div>

        {/* --- LIVE TILES GRID --- */}
        <div className="metro-grid">
          {layout.map((widgetId, index) => {
            const widgetData = WIDGET_REGISTRY[widgetId];

            return (
              <React.Fragment key={widgetId}>
                <div
                  className={`metro-tile ${widgetId === "progress" || widgetId === "calendar" ? "tile-wide" : "tile-medium"} ${isEditing ? "is-editing" : ""}`}
                  style={{
                    backgroundColor: widgetData.color,
                    overflow: "hidden",
                  }}
                  onClick={() => openApp(widgetId)}
                >
                  {isEditing && (
                    <div
                      className="edit-overlay"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="unpin-btn"
                        onClick={() => unpinWidget(index)}
                      >
                        ✕
                      </button>
                      <div className="edit-row">
                        <button
                          className="edit-btn"
                          onClick={() => moveItem(index, -1)}
                          disabled={index === 0}
                        >
                          <span className="material-symbols-sharp">
                            arrow_back
                          </span>
                        </button>
                        <button
                          className="edit-btn"
                          onClick={() => moveItem(index, 1)}
                          disabled={index === layout.length - 1}
                        >
                          <span className="material-symbols-sharp">
                            arrow_forward
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {widgetId === "rewardsCode" && (
                    <>
                      <span className="material-symbols-sharp tile-watermark">
                        qr_code_2
                      </span>
                      <span
                        className="material-symbols-sharp metro-tile-icon"
                        style={{ zIndex: 1 }}
                      >
                        qr_code_2
                      </span>
                      <p className="metro-tile-title" style={{ zIndex: 1 }}>
                        membership
                      </p>
                    </>
                  )}

                  {widgetId === "progress" && (
                    <div className="live-tile-container">
                      <div className="live-tile-inner delay-flip-1">
                        <div className="live-tile-front">
                          <span className="material-symbols-sharp tile-watermark">
                            star
                          </span>
                          <div
                            className="metro-tile-content"
                            style={{ zIndex: 1, textAlign: "left" }}
                          >
                            6 away from <br />
                            free coffee
                          </div>
                          <p
                            className="metro-tile-title"
                            style={{ zIndex: 1, textAlign: "left" }}
                          >
                            rewards
                          </p>
                        </div>
                        <div className="live-tile-back">
                          <div
                            className="metro-tile-content"
                            style={{
                              fontSize: "3rem",
                              textAlign: "center",
                              marginTop: "10px",
                            }}
                          >
                            4 / 10
                          </div>
                          <p
                            className="metro-tile-title"
                            style={{ textAlign: "center" }}
                          >
                            current stars
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {widgetId === "weather" && (
                    <div className="live-tile-container">
                      <div className="live-tile-inner delay-flip-2">
                        <div className="live-tile-front">
                          <span className="material-symbols-sharp tile-watermark">
                            partly_cloudy_day
                          </span>
                          <span
                            className="material-symbols-sharp metro-tile-icon"
                            style={{ zIndex: 1 }}
                          >
                            {weather
                              ? getWeatherDetails(
                                  weather.weathercode,
                                  weather.is_day,
                                ).icon
                              : "partly_cloudy_day"}
                          </span>
                          <div style={{ alignSelf: "flex-start", zIndex: 1 }}>
                            <span className="metro-tile-content">
                              {weather
                                ? `${Math.round(weather.temperature)}°`
                                : "--"}
                            </span>
                            <p className="metro-tile-title">
                              {locationName.split(",")[0]}
                            </p>
                          </div>
                        </div>
                        <div className="live-tile-back">
                          <span className="material-symbols-sharp metro-tile-icon">
                            cloud
                          </span>
                          <p
                            className="metro-tile-title"
                            style={{ alignSelf: "center", textAlign: "center" }}
                          >
                            {weather
                              ? getWeatherDetails(
                                  weather.weathercode,
                                  weather.is_day,
                                ).text
                              : "loading..."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {widgetId === "calendar" && (
                    <div className="live-tile-container">
                      <div className="live-tile-inner delay-flip-3">
                        <div className="live-tile-front">
                          <span className="material-symbols-sharp tile-watermark">
                            calendar_today
                          </span>
                          <div
                            className="metro-tile-content"
                            style={{ zIndex: 1 }}
                          >
                            {new Date()
                              .toLocaleDateString("en-US", { weekday: "long" })
                              .toLowerCase()}
                            <br />
                            {new Date()
                              .toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                              })
                              .toLowerCase()}
                          </div>
                          <p className="metro-tile-title" style={{ zIndex: 1 }}>
                            calendar
                          </p>
                        </div>
                        <div className="live-tile-back">
                          <div
                            className="metro-tile-content"
                            style={{
                              textAlign: "left",
                              fontSize: "1.2rem",
                              marginTop: "5px",
                            }}
                          >
                            no upcoming reservations for today.
                          </div>
                          <p
                            className="metro-tile-title"
                            style={{ textAlign: "left" }}
                          >
                            agenda
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {widgetId === "quickActions" && (
                    <>
                      <span className="material-symbols-sharp tile-watermark">
                        bolt
                      </span>
                      <span
                        className="material-symbols-sharp metro-tile-icon"
                        style={{ zIndex: 1 }}
                      >
                        bolt
                      </span>
                      <p className="metro-tile-title" style={{ zIndex: 1 }}>
                        shortcuts
                      </p>
                    </>
                  )}
                </div>
              </React.Fragment>
            );
          })}

          {isEditing && (
            <div
              className="metro-tile tile-medium"
              style={{
                border: "3px dashed var(--subtext)",
                backgroundColor: "transparent",
              }}
              onClick={() => openApp("addMenu")}
            >
              <span
                className="material-symbols-sharp metro-tile-icon"
                style={{ color: "var(--subtext)" }}
              >
                add
              </span>
              <p
                className="metro-tile-title"
                style={{ color: "var(--subtext)" }}
              >
                pin
              </p>
            </div>
          )}
        </div>
      </main>

      {renderModal()}
    </>
  );
}
