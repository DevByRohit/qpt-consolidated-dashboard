import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// context provider
import { CardProvider } from "./dashboard/CardContext";
import { MasterDataProvider } from "./components/01_form-In-Out/01_hooks/MasterDataContext.jsx";
import { ProductionPlanningProvider } from "./sidebar-elements/production-planning/components/ProductionPlanningContext.jsx";
import { JobCardProvider } from "./sidebar-elements/job-card/components/JobCardContext.jsx";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CardProvider>
        <MasterDataProvider>
          <ProductionPlanningProvider>
            <JobCardProvider>
              <App />
            </JobCardProvider>
          </ProductionPlanningProvider>
        </MasterDataProvider>
      </CardProvider>
    </BrowserRouter>
  </StrictMode>,
);
