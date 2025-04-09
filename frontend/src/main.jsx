import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { getTranslation, translations } from "./utils/localization";

// Register client-side translations to avoid undefined errors
if (typeof window !== "undefined") {
  window.clientLocalizations = {
    translations,
    getTranslation,
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
