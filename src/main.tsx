import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { ShopProvider } from "./context/ShopContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <HashRouter>

      <AuthProvider>

        <ShopProvider>

          <App />

        </ShopProvider>

      </AuthProvider>

    </HashRouter>
  </React.StrictMode>
);