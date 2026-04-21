import React from "react";
import Card from "./Card";

export default function PageHeader({ icon, title, subtitle, className = "" }) {
  return (
    <Card className={className}>
      <div className="top-container">
        <h1 className="blue-h2">
          {icon && (
            <span className="titleIcon material-symbols-rounded">{icon}</span>
          )}
          {title}
        </h1>
        {subtitle && (
          <p id="para" className="subtitle mb-0">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
}
