import CardGrid from "../dashboard/CardGrid";
import { useState } from "react";
import AlertModal from "../alert-modal/AlertModal";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import FormsGrid from "./react-forms/components/FormsGrid";

const PMS = () => {
  const location = useLocation();
  const isProductionPlanning = location.pathname === "/pms";

  const [alert, setAlert] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  // search implement
  const { searchQuery } = useOutletContext();

  return (
    <>
      {isProductionPlanning && (
        <CardGrid module="pms" searchQuery={searchQuery} setAlert={setAlert} />
      )}

      {/* Render nested component inside the PMS */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>

      {/* <FormsGrid /> */}

      <AlertModal
        isOpen={alert.open}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onConfirm={() => {
          if (alert.onConfirm) alert.onConfirm();
          setAlert({ ...alert, open: false });
        }}
        onCancel={() => setAlert({ ...alert, open: false })}
      />
    </>
  );
};

export default PMS;
