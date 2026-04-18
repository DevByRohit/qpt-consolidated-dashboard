import { Link, Outlet, useLocation } from "react-router-dom";

const ReactFormContainer = () => {
  const location = useLocation();
  const isFormsRoute = location.pathname === "/forms";

  return (
    <>
      <div>
        <div className={isFormsRoute ? "block" : "hidden"}>
          <h1>Web forms cards also visible here..</h1>

          <ul className="border-2 border-red-500">
            <Link to={"/forms/in-out"}>
              <li>Material In/Out Form</li>
            </Link>
          </ul>
        </div>

        {/* <Outlet /> */}
        <Outlet />
      </div>
    </>
  );
};

export default ReactFormContainer;
