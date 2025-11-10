// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router";
// import "./index.css";
// import App from "./App.jsx";

// createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// );

import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { init } from "./utils/init.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

try {
  init(retrieveLaunchParams().startParam === "debug" || import.meta.env.DEV);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
} catch (e) {
  console.error(e);
}
