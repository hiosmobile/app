import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, RippleButton, Modal, Switch } from "./HiMaterial";
import { useAuth } from "../src/AuthContext";
import { db } from "../src/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// =========================================
// 1. REWARDS CODE WIDGET
// =========================================
export function RewardsCodeWidget({ code, imageSrc, className = "" }) {
  return (
    <Card className={`${className} h-100 border-0`} bodyClass="p-0 h-100 border-0 d-flex flex-column">
      <div style={{ padding: "16px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ flexGrow: 1, backgroundColor: "var(--primaryContainer)", padding: "12px", borderRadius: "25px" }}>
          <img src={imageSrc} alt="Rewards QR/Barcode" className="img-fluid" style={{ width: "100%", maxWidth: "160px", borderRadius: "25px" }} />
        </div>
        <span className="mt-3 text-center" style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--onBackground)", letterSpacing: "2px", fontStyle: "italic" }}>
          {code}
        </span>
      </div>
    </Card>
  );
}

// =========================================
// 2. REWARDS PROGRESS WIDGET
// =========================================
export function ProgressWidget({ className = "" }) {
  return (
    <Card className={`${className} h-100 border-0`} bodyClass="p-0 h-100 border-0 d-flex flex-column">
      <div style={{ padding: "16px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%" }}>
        <span style={{ fontSize: "1.2rem", fontWeight: "300", color: "var(--onBackground)", letterSpacing: "-0.5px", textTransform: "lowercase", marginBottom: "16px", textAlign: "left" }}>
          rewards progress
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", flexGrow: 1 }}>
          <div className="joinLeft" style={{ backgroundColor: "color-mix(in srgb, var(--surface) 35%, transparent)", padding: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <i className="material-symbols-rounded" style={{ fontSize: "28px", color: "var(--onBackground)", alignSelf: "flex-end", fontWeight: "200" }}>local_cafe</i>
            <div className="text-start mt-3">
              <span style={{ fontSize: "2.5rem", fontWeight: "200", color: "var(--onBackground)", display: "block", lineHeight: "1" }}>
                4<span style={{ fontSize: "1.2rem", opacity: 0.5 }}>/10</span>
              </span>
              <span style={{ fontSize: "13px", fontWeight: "600", textTransform: "lowercase", color: "var(--onBackground)", marginTop: "4px", display: "block" }}>hicafe™</span>
            </div>
          </div>
          <div className="joinRight" style={{ backgroundColor: "color-mix(in srgb, var(--surface) 35%, transparent)", padding: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <i className="material-symbols-rounded" style={{ fontSize: "28px", color: "var(--onBackground)", alignSelf: "flex-end", fontWeight: "200" }}>hotel</i>
            <div className="text-start mt-3">
              <span style={{ fontSize: "2.5rem", fontWeight: "200", color: "var(--onBackground)", display: "block", lineHeight: "1" }}>
                6<span style={{ fontSize: "1.2rem", opacity: 0.5 }}>/20</span>
              </span>
              <span style={{ fontSize: "13px", fontWeight: "600", textTransform: "lowercase", color: "var(--onBackground)", marginTop: "4px", display: "block" }}>web&b stays</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// =========================================
// 3. WEATHER WIDGET
// =========================================
export function WeatherWidget({ className = "", isExpanded = false }) {
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const getWeatherDetails = (code, isDay) => {
    if (code === 0) return { icon: isDay ? "light_mode" : "dark_mode", text: "clear sky" };
    if (code >= 1 && code <= 3) return { icon: isDay ? "partly_cloudy_day" : "partly_cloudy_night", text: "partly cloudy" };
    if (code === 45 || code === 48) return { icon: "foggy", text: "fog" };
    if (code >= 51 && code <= 55) return { icon: "rainy", text: "drizzle" };
    if (code >= 61 && code <= 65) return { icon: "rainy", text: "rain" };
    if (code >= 71 && code <= 77) return { icon: "cloudy_snowing", text: "snow" };
    if (code >= 80 && code <= 82) return { icon: "rainy", text: "rain showers" };
    if (code >= 95 && code <= 99) return { icon: "thunderstorm", text: "thunderstorms" };
    return { icon: "cloud", text: "unknown" };
  };

  const fetchWeather = async (lat, lon, name) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
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
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchInput)}&format=json&limit=5`);
      const data = await res.json();
      if (data && data.length > 0) setSearchResults(data);
      else setError("No locations found.");
    } catch (err) {
      setError("Failed to search location.");
    } finally {
      setIsSearching(false);
    }
  };

  const selectLocation = async (lat, lon, displayName) => {
    const nameParts = displayName.split(", ");
    const shortName = nameParts.length > 1 ? `${nameParts[0]}, ${nameParts[nameParts.length - 1]}` : nameParts[0];

    localStorage.setItem("hios_weather_pref", JSON.stringify({ lat, lon, name: shortName }));
    setSearchResults([]);
    setSearchInput("");
    setIsEditing(false);
    window.dispatchEvent(new Event("hiosWeatherUpdated"));
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || "Current Location";
            localStorage.setItem("hios_weather_pref", JSON.stringify({ lat: latitude, lon: longitude, name: city }));
            setIsEditing(false);
            window.dispatchEvent(new Event("hiosWeatherUpdated"));
          } catch {
            fetchWeather(latitude, longitude, "Current Location");
          }
        },
        () => fetchWeather(51.5085, -0.1257, "London, United Kingdom")
      );
    } else {
      fetchWeather(51.5085, -0.1257, "London, United Kingdom");
    }
  };

  useEffect(() => {
    const loadSavedWeather = () => {
      const savedLocation = localStorage.getItem("hios_weather_pref");
      if (savedLocation) {
        const { lat, lon, name } = JSON.parse(savedLocation);
        fetchWeather(lat, lon, name);
      } else {
        getUserLocation();
      }
    };
    loadSavedWeather();
    window.addEventListener("hiosWeatherUpdated", loadSavedWeather);
    return () => window.removeEventListener("hiosWeatherUpdated", loadSavedWeather);
  }, []);

  const tilePadding = isExpanded ? "0" : "16px";
  const wrapperClass = `w-100 h-100 text-start d-flex flex-column ${className}`.trim();

  if (isEditing && isExpanded) {
    return (
      <div className={wrapperClass}>
        <div className="d-flex flex-column" style={{ gap: "8px" }}>
          <form onSubmit={handleSearch} className="d-flex align-items-center" style={{ gap: "8px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="search city..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ flexGrow: 1, margin: 0, padding: "10px 20px", height: "45px", borderRadius: "0", background: "color-mix(in srgb, var(--surface) 40%, transparent)", border: "1px solid var(--primary)", color: "var(--onBackground)" }}
              autoFocus
            />
            <button type="button" className="nav-icon-btn" onClick={() => setIsEditing(false)} style={{ color: "var(--onBackground)" }}>
              <i className="material-symbols-rounded">close</i>
            </button>
          </form>

          <button
            onClick={getUserLocation}
            style={{
              backgroundColor: "color-mix(in srgb, var(--primary) 40%, transparent)",
              padding: "12px",
              color: "var(--onBackground)",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              border: "none",
              gap: "12px",
            }}
          >
            <i className="material-symbols-rounded" style={{ fontSize: "18px" }}>my_location</i> use current location
          </button>

          {isSearching && (
            <div className="d-flex justify-content-center p-4">
              <i className="material-symbols-rounded" style={{ animation: "pulse 1.5s infinite", color: "var(--primary)" }}>sync</i>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="d-flex flex-column" style={{ gap: "2px", marginTop: "8px" }}>
              {searchResults.map((result) => (
                <button
                  key={result.place_id}
                  onClick={() => selectLocation(result.lat, result.lon, result.display_name)}
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--surface) 30%, transparent)",
                    padding: "12px",
                    color: "var(--onBackground)",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "14px",
                    border: "none",
                  }}
                >
                  {result.display_name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass} style={{ minHeight: isExpanded ? "auto" : "180px", position: "relative", padding: tilePadding }}>
      <div className="d-flex justify-content-between align-items-start">
        <span style={{ fontSize: isExpanded ? "2rem" : "1.2rem", fontWeight: "300", color: "var(--onBackground)", letterSpacing: "-0.5px", textTransform: "lowercase", position: "relative", zIndex: 2 }}>
          {locationName}
        </span>
        {isExpanded && (
          <button onClick={() => setIsEditing(true)} className="nav-icon-btn" style={{ padding: "0", color: "var(--onBackground)", zIndex: 2 }}>
            <i className="material-symbols-rounded" style={{ fontSize: "28px", fontWeight: "300" }}>edit</i>
          </button>
        )}
      </div>

      {error && <div className="mt-2" style={{ color: "var(--error)", fontSize: "14px", zIndex: 2, position: "relative" }}>{error}</div>}

      <div style={{ position: isExpanded ? "relative" : "absolute", bottom: isExpanded ? "auto" : "16px", left: isExpanded ? "auto" : "16px", right: isExpanded ? "auto" : "16px", marginTop: isExpanded ? "40px" : "0", zIndex: 2 }}>
        {loading ? (
          <i className="material-symbols-rounded" style={{ animation: "pulse 1.5s infinite", fontSize: isExpanded ? "48px" : "32px", color: "var(--onBackground)" }}>sync</i>
        ) : weather ? (
          <div className="d-flex justify-content-between align-items-end w-100">
            <div className="d-flex flex-column text-start">
              <span style={{ fontSize: isExpanded ? "6rem" : "4.5rem", fontWeight: "200", lineHeight: "0.9", color: "var(--onBackground)", letterSpacing: "-2px" }}>
                {Math.round(weather.temperature)}°C
              </span>
              <div className="d-flex flex-column mt-2" style={{ color: "var(--onBackground)" }}>
                <span style={{ fontSize: isExpanded ? "1.2rem" : "1rem", fontWeight: "400" }}>
                  {getWeatherDetails(weather.weathercode, weather.is_day).text}
                </span>
                <span style={{ fontSize: isExpanded ? "1rem" : "0.85rem", opacity: 0.8 }}>
                  wind: {weather.windspeed} km/h
                </span>
              </div>
            </div>
            <i className="material-symbols-rounded" style={{ fontSize: isExpanded ? "100px" : "70px", color: "var(--onBackground)", fontVariationSettings: "'FILL' 0, 'wght' 200" }}>
              {getWeatherDetails(weather.weathercode, weather.is_day).icon}
            </i>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// =========================================
// 4. DATE WIDGET
// =========================================
export function DateWidget({ className = "", isExpanded = false }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const dayNames = ["su", "mo", "tu", "we", "th", "fr", "sa"];

  const calendarCells = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const wrapperClass = `d-flex flex-column w-100 h-100 ${className}`.trim();
  const tilePadding = isExpanded ? "0" : "16px";

  return (
    <div className={wrapperClass} style={{ padding: tilePadding, position: "relative", zIndex: 2 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isExpanded ? "32px" : "16px" }}>
        <span style={{ color: "var(--onBackground)", fontSize: isExpanded ? "2.5rem" : "1.5rem", fontWeight: "200", letterSpacing: "-1px" }}>
          {monthNames[month]} {year}
        </span>
        <div className="d-flex gap-1">
          <button className="joinLeft" onClick={(e) => { e.stopPropagation(); setCurrentDate(new Date(year, month - 1, 1)); }} style={{ background: "transparent", border: "1px solid var(--onBackground)", color: "var(--onBackground)", cursor: "pointer", padding: "4px", display: "flex" }}>
            <span className="material-symbols-sharp" style={{ fontSize: "24px", fontWeight: "200" }}>arrow_back</span>
          </button>
          <button className="joinRight" onClick={(e) => { e.stopPropagation(); setCurrentDate(new Date(year, month + 1, 1)); }} style={{ background: "transparent", border: "1px solid var(--onBackground)", color: "var(--onBackground)", cursor: "pointer", padding: "4px", display: "flex" }}>
            <span className="material-symbols-sharp" style={{ fontSize: "24px", fontWeight: "200" }}>arrow_forward</span>
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "2px", textAlign: "center", color: "var(--onBackground)", fontSize: isExpanded ? "16px" : "12px", fontWeight: "600", textTransform: "lowercase" }}>
        {dayNames.map((day) => <div key={day} style={{ padding: "4px 0" }}>{day}</div>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {calendarCells.map((day, idx) => {
          const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
          return (
            <div
              key={idx}
              style={{
                aspectRatio: "1/1",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                padding: "8px",
                backgroundColor: isToday ? "var(--primary)" : day ? "color-mix(in srgb, var(--surface) 35%, transparent)" : "transparent",
                color: isToday ? "var(--onPrimary)" : "var(--onBackground)",
                fontWeight: isToday ? "600" : "300",
                fontSize: isExpanded ? "24px" : "16px",
              }}
            >
              {day || ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =========================================
// 5. QUICK ACTIONS WIDGET
// =========================================
const APP_PAGES = [
  { id: "hicafe", label: "Your HiCafe™ Visit", icon: "dining", path: "/restaurant/hicafe" },
  { id: "cafefiesta", label: "CafeFiesta", icon: "coffee", path: "/restaurant/cafefiesta" },
  { id: "hotel", label: "Stay", icon: "hotel", path: "/hotelactivities" },
  { id: "rewards", label: "Rewards", icon: "award_star", path: "/hirewards" },
  { id: "settings", label: "Profile", icon: "account_circle", path: "/profile" },
  { id: "help", label: "Help", icon: "help", path: "/help" },
];

const DEFAULT_QUICK_ACTIONS = ["hicafe", "hotel"];

export function QuickActionsWidget({ isEditing, className = "" }) {
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
            localStorage.setItem("hiosQuickActions", JSON.stringify(cloudActions));
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
    if (activeActions.includes(id)) newActions = activeActions.filter((a) => a !== id);
    else newActions = [...activeActions, id];

    setActiveActions(newActions);
    localStorage.setItem("hiosQuickActions", JSON.stringify(newActions));

    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      setDoc(docRef, { quickActions: newActions }, { merge: true });
    }
  };

  const visiblePages = APP_PAGES.filter((page) => activeActions.includes(page.id));

  return (
    <>
      <Card className={`${className} h-100 border-0`} bodyClass="p-0 h-100 border-0 d-flex flex-column">
        <div style={{ padding: "16px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%" }}>
          <span style={{ fontSize: "1.2rem", fontWeight: "300", color: "var(--onBackground)", letterSpacing: "-0.5px", textTransform: "lowercase", marginBottom: "16px", textAlign: "left" }}>
            quick actions
          </span>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", flexGrow: 1 }}>
            {visiblePages.length === 0 && !isEditing ? (
                          <p className="small mb-0" style={{ gridColumn: "span 2", color: "var(--onBackground)", opacity: 0.6 }}>no shortcuts selected.</p>
                        ) : (
                          visiblePages.map((page) => (
                            <button
                              key={page.id}
                              /* Apply the new 3D tilt class here */
                              className={`metro-tile-btn ${isEditing ? "opacity-50" : ""}`}
                              onClick={() => !isEditing && navigate(page.path)}
                              style={{
                                backgroundColor: "color-mix(in srgb, var(--surface) 35%, transparent)",
                                border: "none",
                                color: "var(--onBackground)",
                                padding: "20px 8px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                cursor: isEditing ? "default" : "pointer"
                              }}
                            >
                              <i className="material-symbols-rounded" style={{ fontSize: "32px", fontWeight: "200" }}>{page.icon}</i>
                              <span style={{ fontSize: "13px", fontWeight: "600", textTransform: "lowercase" }}>{page.label}</span>
                            </button>
                          ))
                        )}

            {isEditing && (
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="metro-tile-btn" // Added here
                            style={{
                              gridColumn: "span 2",
                              backgroundColor: "transparent",
                              border: "1px dashed var(--onBackground)",
                              color: "var(--onBackground)",
                              padding: "12px",
                              marginTop: "8px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px"
                            }}
                          >
                            <i className="material-symbols-rounded" style={{ fontSize: "20px", fontWeight: "300" }}>edit</i>
                            <span style={{ fontSize: "14px", fontWeight: "400", textTransform: "lowercase" }}>edit shortcuts</span>
                          </button>
                        )}
          </div>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} title="select shortcuts" appName="quick actions">
        <p className="text-start mb-3" style={{ textTransform: "lowercase" }}>
          choose which pages appear in your quick actions widget.
        </p>
        <div className="d-flex flex-column" style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid var(--outline)" }}>
          {APP_PAGES.map((page) => (
            <Switch
              key={page.id}
              label={page.label}
              checked={activeActions.includes(page.id)}
              onChange={() => toggleAction(page.id)}
              className="joinMiddle"
              style={{ borderRadius: "0" }}
            />
          ))}
        </div>
        <div className="mt-4">
          <button
            type="button"
            className="button"
            style={{ width: "100%", margin: 0, backgroundColor: "var(--primary)", color: "var(--onPrimary)", border: "none", borderRadius: "0" }}
            onClick={() => setIsModalOpen(false)}
          >
            done
          </button>
        </div>
      </Modal>
    </>
  );
}
