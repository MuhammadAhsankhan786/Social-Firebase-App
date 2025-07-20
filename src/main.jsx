import React from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css"
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
// import ContextProvider from "./context/Context.jsx";
import ContextProvider from "./context/Context.jsx"; // ✅ small 'c' in context

createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ContextProvider>
);
