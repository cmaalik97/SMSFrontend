import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any <Route> element in this. If nobody's logged in -> kick to /signin.
// If logged in but wrong role -> kick to their own dashboard.
export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthed } = useAuth();

  if (!isAuthed) return <Navigate to="/signin" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const home = user.role === "Admin" ? "/admin" : user.role === "Teacher" ? "/teacher" : "/student";
    return <Navigate to={home} replace />;
  }

  return children;
}
