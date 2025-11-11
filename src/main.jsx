import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import WebApp from '@twa-dev/sdk'
import "./index.css";
import App from "./App.jsx";


WebApp.ready();


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
