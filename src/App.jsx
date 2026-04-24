import { Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import Protected from "./protected/Protected";
import DashboardLayout from "./dashboard/DashboardLayout";

// Side Navbar Elements
import Index from "./sidebar-elements/Index";
import IMS from "./sidebar-elements/IMS";
import FMS from "./sidebar-elements/FMS";
import PMS from "./sidebar-elements/PMS";
import Dashboards from "./sidebar-elements/Dashboards";
import ReactFormContainer from "./sidebar-elements/ReactFormContainer";

// Material In/Out form and Edit window
import MainInOutForm from "./components/01_form-In-Out/MainInOutForm";
import EditEntries from "./components/01_form-In-Out/EditEntries";

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
        <Route index element={<Index />} />
        <Route path="ims" element={<IMS />} />
        <Route path="fms" element={<FMS />} />
        <Route path="pms" element={<PMS />} />
        <Route path="dashboard" element={<Dashboards />} />

        {/* Nested routes for web based forms inside the sidebar element for container */}
        <Route path="forms" element={<ReactFormContainer />}>
          <Route path="in-out" element={<MainInOutForm />} />
          <Route path="in-out/edit" element={<EditEntries />} />
        </Route>

        {/* Nested routes for editing the different system data which we submit by react forms  */}
      </Route>
    </Routes>
  );
}

export default App;
