import { Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import Protected from "./protected/Protected";
import RoleProtectedRoute from "./protected/RoleProtectedRoute";
import DashboardLayout from "./dashboard/DashboardLayout";

// Side Navbar Elements
import Index from "./sidebar-elements/Index";
import IMS from "./sidebar-elements/IMS";
import FMS from "./sidebar-elements/FMS";
import PMS from "./sidebar-elements/PMS";
import Dashboards from "./sidebar-elements/Dashboards";
import ReactFormContainer from "./sidebar-elements/ReactFormContainer";
import PayrollOperations from "./sidebar-elements/PayrollOperations";

// Material In/Out form and Edit window
import MainInOutForm from "./components/01_form-In-Out/MainInOutForm";
import EditEntries from "./components/01_form-In-Out/EditEntries";

// Salary distribution system
import SalaryDistribution from "./sidebar-elements/salary-distribution/SalaryDistribution";

// Production Planning system
import ProductionPlanning from "./sidebar-elements/production-planning/ProductionPlanning";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Protected Layout */}
      <Route
        path="/"
        element={
          <Protected>
            <DashboardLayout />
          </Protected>
        }
      >
        {/* Nested routes for sidebar */}
        <Route path="/" element={<Index />} />
        <Route path="ims" element={<IMS />} />
        <Route path="fms" element={<FMS />} />
        <Route path="dashboard" element={<Dashboards />} />

        {/* Nested routes for web based forms inside the sidebar element for container */}
        <Route path="forms" element={<ReactFormContainer />}>
          <Route path="in-out" element={<MainInOutForm />} />
          <Route path="in-out/edit" element={<EditEntries />} />
        </Route>

        <Route path="pms" element={<PMS />}>
          <Route path="production-planning" element={<ProductionPlanning />} />
        </Route>

        {/* Nested routes for salary distribution system */}
        <Route
          path="payroll"
          element={
            <RoleProtectedRoute>
              <PayrollOperations />
            </RoleProtectedRoute>
          }
        >
          <Route path="salary-dist" element={<SalaryDistribution />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
