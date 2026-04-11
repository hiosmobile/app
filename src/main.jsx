import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "../components/navigation.css";
import "../components/layout.css";
import "./assets/style.css"; // style.css loads last, ensuring its theme/glass variables overrule everything else

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
