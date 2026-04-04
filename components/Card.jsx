import React from "react";
import { motion } from "framer-motion";

export default function Card({
  title,
  children,
  className = "",
  bodyClass = "",
}) {
  const isJoining =
    className.includes("joinTop") ||
    className.includes("joinBottom") ||
    className.includes("joinMiddle");

  const baseClass = isJoining ? "card" : "card full";

  return (
    <motion.div
      className={`${baseClass} ${className}`.trim()}
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "16px",
      }}
    >
      <div className={`card-body ${bodyClass}`.trim()}>
        {title && <h5 className="card-title">{title}</h5>}
        {children}
      </div>
    </motion.div>
  );
}
