import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import FormsGrid from "./react-forms/components/FormsGrid";

const ReactFormContainer = () => {
  const location = useLocation();
  const isFormsRoute = location.pathname === "/forms";

  // search implement
  const { searchQuery } = useOutletContext();

  return (
    <div className="flex flex-col">
      {/* Forms Listing */}
      {isFormsRoute && (
        <>
          <FormsGrid />
        </>
      )}

      {/* Form Render */}
      <div className="flex-1 overflow-hidden">
        <Outlet context={{ searchQuery: searchQuery }} />
      </div>
    </div>
  );
};

export default ReactFormContainer;
