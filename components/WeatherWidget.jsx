import React, { useState, useEffect } from "react";

export default function WeatherWidget() {
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

    // Save to local storage
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

            // Save current location to local storage
            localStorage.setItem(
              "hios_weather_pref",
              JSON.stringify({ lat: latitude, lon: longitude, name: city }),
            );

            fetchWeather(latitude, longitude, city);
            setIsEditing(false); // Close edit menu if opened
          } catch {
            fetchWeather(latitude, longitude, "Current Location");
          }
        },
        (err) => {
          // Default fallback
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
    // Check if a location was previously saved
    const savedLocation = localStorage.getItem("hios_weather_pref");
    if (savedLocation) {
      const { lat, lon, name } = JSON.parse(savedLocation);
      fetchWeather(lat, lon, name);
    } else {
      // Only prompt for GPS if there's no saved location
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
