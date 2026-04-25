import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, MenuActionBtn, RippleButton, Modal, Switch } from "./HiMaterial";
import { useAuth } from "../src/AuthContext";
import { db } from "../src/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// =========================================
// QUICK ACTIONS WIDGET
// =========================================
const APP_PAGES = [
  {
    id: "restaurant",
    label: "Restaurant",
    icon: "restaurant",
    path: "/restaurant",
  },
  {
    id: "hicafe",
    label: "HiCafe™",
    icon: "local_cafe",
    path: "/restaurant/hicafe",
  },
  {
    id: "breakfast",
    label: "Breakfast",
    icon: "bakery_dining",
    path: "/restaurant/breakfast",
  },
  {
    id: "cafefiesta",
    label: "Cafe Fiesta",
    icon: "local_pizza",
    path: "/restaurant/cafefiesta",
  },
  {
    id: "locations",
    label: "Locations",
    icon: "location_on",
    path: "/restaurant/locations",
  },
  {
    id: "hotel",
    label: "Hotel Activities",
    icon: "pool",
    path: "/hotelactivities",
  },
  { id: "rewards", label: "HiRewards", icon: "award_star", path: "/hirewards" },
  { id: "settings", label: "Settings", icon: "settings", path: "/settings" },
  { id: "help", label: "Help Center", icon: "help", path: "/help" },
];

const DEFAULT_QUICK_ACTIONS = ["hicafe", "hotel"];

export function QuickActionsWidget({ isEditing }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeActions, setActiveActions] = useState(() => {
    const cached = localStorage.getItem("hiosQuickActions");
    return cached ? JSON.parse(cached) : DEFAULT_QUICK_ACTIONS;
  });

  useEffect(() => {
    const fetchActions = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(docRef);
          if (snap.exists() && snap.data().quickActions) {
            const cloudActions = snap.data().quickActions;
            setActiveActions(cloudActions);
            localStorage.setItem(
              "hiosQuickActions",
              JSON.stringify(cloudActions),
            );
          }
        } catch (error) {
          console.error("Failed to load quick actions:", error);
        }
      }
    };
    fetchActions();
  }, [currentUser]);

  const toggleAction = (id) => {
    let newActions;
    if (activeActions.includes(id)) {
      newActions = activeActions.filter((a) => a !== id);
    } else {
      newActions = [...activeActions, id];
    }

    setActiveActions(newActions);
    localStorage.setItem("hiosQuickActions", JSON.stringify(newActions));

    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      setDoc(docRef, { quickActions: newActions }, { merge: true });
    }
  };

  const visiblePages = APP_PAGES.filter((page) =>
    activeActions.includes(page.id),
  );

  return (
    <>
      <Card title="Quick Actions">
        <div className="mt-3">
          {visiblePages.length === 0 && !isEditing ? (
            <p className="text-muted small mb-0">No shortcuts selected.</p>
          ) : (
            visiblePages.map((page, index) => {
              const isFirst = index === 0;
              const isLast = index === visiblePages.length - 1;
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
                  key={page.id}
                  icon={page.icon}
                  text={page.label}
                  className={isEditing ? `${joinClass} opacity-50` : joinClass}
                  onClick={() => !isEditing && navigate(page.path)}
                />
              );
            })
          )}

          {isEditing && (
            <RippleButton
              className="button full mt-3 d-flex align-items-center justify-content-center"
              style={{
                border: "2px dashed var(--primary)",
                backgroundColor: "transparent",
                color: "var(--primary)",
              }}
              onClick={() => setIsModalOpen(true)}
            >
              <span className="material-symbols-rounded me-2">edit_square</span>
              Customize Shortcuts
            </RippleButton>
          )}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} title="Select Shortcuts">
        <p className="text-start mb-3">
          Choose which pages appear in your Quick Actions widget.
        </p>

        <div
          className="d-flex flex-column"
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--outline)",
          }}
        >
          {APP_PAGES.map((page, index) => {
            const isFirst = index === 0;
            const isLast = index === APP_PAGES.length - 1;
            const joinClass =
              isFirst && isLast
                ? "full"
                : isFirst
                  ? "joinTop"
                  : isLast
                    ? "joinBottom"
                    : "joinMiddle";

            return (
              <Switch
                key={page.id}
                label={page.label}
                checked={activeActions.includes(page.id)}
                onChange={() => toggleAction(page.id)}
                className={joinClass}
              />
            );
          })}
        </div>

        <div className="mt-4">
          <RippleButton
            type="button"
            className="form-button w-100 m-0"
            onClick={() => setIsModalOpen(false)}
          >
            Done
          </RippleButton>
        </div>
      </Modal>
    </>
  );
}

// =========================================
// WEATHER WIDGET
// =========================================
export function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const getWeatherDetails = (code, isDay) => {
    if (code === 0)
      return { icon: isDay ? "light_mode" : "dark_mode", text: "Clear Sky" };
    if (code === 1 || code === 2 || code === 3)
      return {
        icon: isDay ? "partly_cloudy_day" : "partly_cloudy_night",
        text: "Partly Cloudy",
      };
    if (code === 45 || code === 48) return { icon: "foggy", text: "Fog" };
    if (code >= 51 && code <= 55) return { icon: "rainy", text: "Drizzle" };
    if (code >= 61 && code <= 65) return { icon: "rainy", text: "Rain" };
    if (code >= 71 && code <= 77)
      return { icon: "cloudy_snowing", text: "Snow" };
    if (code >= 80 && code <= 82)
      return { icon: "rainy", text: "Rain Showers" };
    if (code >= 95 && code <= 99)
      return { icon: "thunderstorm", text: "Thunderstorm" };
    return { icon: "cloud", text: "Unknown" };
  };

  const fetchWeather = async (lat, lon, name) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
      );
      const data = await res.json();
      setWeather(data.current_weather);
      setLocationName(name);
    } catch (err) {
      setError("Failed to fetch weather.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    try {
      setIsSearching(true);
      setError(null);
      setSearchResults([]);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchInput)}&format=json&limit=5`,
      );
      const data = await res.json();

      if (data && data.length > 0) {
        setSearchResults(data);
      } else {
        setError("No locations found.");
      }
    } catch (err) {
      setError("Failed to search location.");
    } finally {
      setIsSearching(false);
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
    setIsEditing(false);
    await fetchWeather(lat, lon, shortName);
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            );
            const data = await res.json();
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "Current Location";

            localStorage.setItem(
              "hios_weather_pref",
              JSON.stringify({ lat: latitude, lon: longitude, name: city }),
            );

            fetchWeather(latitude, longitude, city);
            setIsEditing(false);
          } catch {
            fetchWeather(latitude, longitude, "Current Location");
          }
        },
        (err) => {
          fetchWeather(51.5085, -0.1257, "London, United Kingdom");
        },
      );
    } else {
      fetchWeather(51.5085, -0.1257, "London, United Kingdom");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setSearchInput("");
    setSearchResults([]);
    setError(null);
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem("hios_weather_pref");
    if (savedLocation) {
      const { lat, lon, name } = JSON.parse(savedLocation);
      fetchWeather(lat, lon, name);
    } else {
      getUserLocation();
    }
  }, []);

  return (
    <div
      className="translucentAboutBox p-3 d-flex flex-column"
      style={{ width: "100%", boxSizing: "border-box" }}
    >
      {isEditing ? (
        <div className="d-flex flex-column" style={{ gap: "8px" }}>
          <form
            onSubmit={handleSearch}
            className="d-flex align-items-center"
            style={{ gap: "8px" }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Search city..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                flexGrow: 1,
                margin: 0,
                padding: "10px 20px",
                height: "45px",
              }}
              autoFocus
            />
            <button
              type="submit"
              className="nav-icon-btn"
              style={{ color: "var(--primary)" }}
            >
              <i className="material-symbols-rounded">search</i>
            </button>
            <button
              type="button"
              className="nav-icon-btn"
              onClick={cancelEdit}
              style={{ color: "var(--onTertiaryContainer)" }}
            >
              <i className="material-symbols-rounded">close</i>
            </button>
          </form>

          <button
            onClick={getUserLocation}
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--primary) 15%, transparent)",
              borderRadius: "25px",
              padding: "10px 14px",
              color: "var(--primary)",
              textAlign: "center",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              gap: "8px",
            }}
          >
            <i
              className="material-symbols-rounded"
              style={{ fontSize: "18px" }}
            >
              my_location
            </i>{" "}
            Use Current Location
          </button>

          {isSearching && (
            <div className="d-flex justify-content-center p-2">
              <i
                className="material-symbols-rounded"
                style={{
                  animation: "pulse 1.5s infinite",
                  color: "var(--primary)",
                }}
              >
                sync
              </i>
            </div>
          )}

          {searchResults.length > 0 && (
            <div
              className="d-flex flex-column"
              style={{ gap: "4px", marginTop: "4px" }}
            >
              {searchResults.map((result) => (
                <button
                  key={result.place_id}
                  onClick={() =>
                    selectLocation(result.lat, result.lon, result.display_name)
                  }
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--surfaceVarient) 50%, transparent)",
                    borderRadius: "25px",
                    padding: "10px 14px",
                    color: "var(--onTertiaryContainer)",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    border: "1px solid var(--onTertiaryContainer)",
                  }}
                >
                  {result.display_name}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: "700",
              color: "var(--onTertiaryContainer)",
            }}
          >
            {locationName}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="nav-icon-btn"
            style={{ padding: "4px", color: "var(--onTertiaryContainer)" }}
          >
            <i
              className="material-symbols-rounded"
              style={{ fontSize: "24px" }}
            >
              edit_location
            </i>
          </button>
        </div>
      )}

      {error && (
        <div
          className="mb-2"
          style={{ color: "var(--error)", fontSize: "14px", fontWeight: "600" }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-4">
          <i
            className="material-symbols-rounded"
            style={{
              animation: "pulse 1.5s infinite",
              fontSize: "32px",
              color: "var(--primary)",
            }}
          >
            sync
          </i>
        </div>
      ) : weather && !isEditing ? (
        <div className="d-flex align-items-center mt-1" style={{ gap: "20px" }}>
          <i
            className="material-symbols-rounded"
            style={{
              fontSize: "64px",
              color: "var(--primary)",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            {getWeatherDetails(weather.weathercode, weather.is_day).icon}
          </i>
          <div className="d-flex flex-column justify-content-center text-start">
            <span
              style={{
                fontSize: "48px",
                fontWeight: "800",
                lineHeight: "1",
                color: "var(--onTertiaryContainer)",
              }}
            >
              {Math.round(weather.temperature)}°
            </span>
            <span
              className="mt-1"
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "var(--onTertiaryContainer)",
              }}
            >
              {getWeatherDetails(weather.weathercode, weather.is_day).text} •
              Wind: {weather.windspeed} km/h
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// =========================================
// DATE WIDGET
// =========================================
export function DateWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const resetToToday = () => setCurrentDate(new Date());

  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalCells = [...blanks, ...days];

  return (
    <div
      className="translucentAboutBox p-3 d-flex flex-column mt-2"
      style={{ width: "100%", boxSizing: "border-box" }}
    >
      {/* Header Controls */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          onClick={prevMonth}
          className="nav-icon-btn"
          style={{ padding: "4px", color: "var(--onTertiaryContainer)" }}
        >
          <i className="material-symbols-rounded" style={{ fontSize: "24px" }}>
            chevron_left
          </i>
        </button>

        <button
          onClick={resetToToday}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.2rem",
            fontWeight: "700",
            color: "var(--onTertiaryContainer)",
            cursor: "pointer",
          }}
        >
          {monthNames[month]} {year}
        </button>

        <button
          onClick={nextMonth}
          className="nav-icon-btn"
          style={{ padding: "4px", color: "var(--onTertiaryContainer)" }}
        >
          <i className="material-symbols-rounded" style={{ fontSize: "24px" }}>
            chevron_right
          </i>
        </button>
      </div>

      {/* Days of the Week Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
          marginBottom: "8px",
          textAlign: "center",
        }}
      >
        {dayNames.map((day) => (
          <div
            key={day}
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--onTertiaryContainer)",
              opacity: 0.7,
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
        }}
      >
        {totalCells.map((day, index) => {
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <div
              key={index}
              className="d-flex justify-content-center align-items-center"
              style={{
                height: "36px",
                borderRadius: "50%",
                fontSize: "14px",
                fontWeight: isToday ? "700" : "500",
                backgroundColor: isToday ? "var(--primary)" : "transparent",
                color: isToday
                  ? "var(--onPrimary)"
                  : "var(--onTertiaryContainer)",
                opacity: day ? 1 : 0,
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =========================================
// RewardsCodeWidget
// =========================================
export function RewardsCodeWidget({ code, imageSrc }) {
  return (
    <Card title="Your rewards code">
      <img
        src={imageSrc}
        alt="Rewards QR/Barcode"
        className="img-fluid roundedImage"
      />
      <p className="mb-0">
        <i>{code}</i>
      </p>
    </Card>
  );
}
