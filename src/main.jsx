import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { CardProvider } from "./dashboard/CardContext";
import { MasterDataProvider } from "./components/01_form-In-Out/01_hooks/MasterDataContext.jsx";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CardProvider>
        <MasterDataProvider>
          <App />
        </MasterDataProvider>
      </CardProvider>
    </BrowserRouter>
  </StrictMode>,
);
