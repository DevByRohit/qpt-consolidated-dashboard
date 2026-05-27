import { Navigate } from "react-router-dom";

function Protected({ children }) {
  if (!localStorage.getItem("login")) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
// I want to protect the PayrollOperations.jsx sidebar element and only accounts can access this

export default Protected;
