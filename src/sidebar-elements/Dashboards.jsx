import CardGrid from "../dashboard/CardGrid";
import { useState } from "react";
import AlertModal from "../alert-modal/AlertModal";
import { useOutletContext } from "react-router-dom";

const Dashboards = () => {
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
      <CardGrid
        module="dashboard"
        searchQuery={searchQuery}
        setAlert={setAlert}
      />

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

export default Dashboards;
