import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import EntityPage from "./pages/EntityPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AttendancePage from "./pages/AttendancePage";
export default function App() {
  return (
    <Routes>
      {/* Public site - outside the system */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>

      {/* Admin - sidebar with all 9 tables */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path=":entity" element={<EntityPage />} />
      </Route>

      {/* Teacher - own subjects/classes/salary only */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={["Teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* Student - own attendance/results/fees only */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Home />} />
    </Routes>
  );
}
