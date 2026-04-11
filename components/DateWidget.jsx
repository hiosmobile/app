import React, { useState } from "react";

export default function DateWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get today's date for highlighting
  const today = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get the number of days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Get the day of the week the month starts on (0 = Sunday, 1 = Monday, etc.)
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

  // Navigation handlers
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const resetToToday = () => setCurrentDate(new Date());

  // Generate grid cells
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
                opacity: day ? 1 : 0, // Hide empty padding cells
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
