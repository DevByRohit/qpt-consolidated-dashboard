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
import MaterialForm from "./components/Material Form/MaterialForm";
import ReactFormContainer from "./sidebar-elements/ReactFormContainer";

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
        {/* Nested Routes (IMPORTANT) */}
        <Route index element={<Index />} />
        <Route path="ims" element={<IMS />} />
        <Route path="fms" element={<FMS />} />
        <Route path="pms" element={<PMS />} />
        <Route path="forms" element={<ReactFormContainer />} />
        <Route path="forms/in-out" element={<MaterialForm />} />
        <Route path="dashboard" element={<Dashboards />} />
      </Route>
    </Routes>
  );
}

export default App;
