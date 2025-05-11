import { useContext } from "react";
import { Navigate } from "react-router";
import { UserContext } from "../contexts/UserContext";

export function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);
  if (!user || !user.id) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
