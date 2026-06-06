import CardGrid from "../dashboard/CardGrid";
import { useState } from "react";
import AlertModal from "../alert-modal/AlertModal";
import { Outlet, useOutletContext, useLocation } from "react-router-dom";

const PayrollOperations = () => {
  const location = useLocation();
  const isPayrollSystem = location.pathname === "/payroll";

  const [alert, setAlert] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  // search implementation
  const { searchQuery } = useOutletContext();

  return (
    <>
      {isPayrollSystem && (
        <CardGrid
          module="payroll"
          searchQuery={searchQuery}
          setAlert={setAlert}
        />
      )}

      {/* Render nested component inside the PayrollOperations */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>

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

export default PayrollOperations;
