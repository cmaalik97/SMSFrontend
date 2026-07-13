import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const TITLES = {
  "/admin": "Dashboard",
  "/admin/students": "Students",
  "/admin/teachers": "Teachers",
  "/admin/fees": "Fees",
  "/admin/classes": "Classes",
  "/admin/results": "Results",
  "/admin/subjects": "Subjects",
  "/admin/attendance": "Attendance",
  "/admin/users": "Users",
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const title = TITLES[pathname] || "Dashboard";

  // Downloads everything currently loaded from the API as a JSON file.
  // (In a fuller build this would call a dedicated /api/export endpoint instead.)
  const handleExport = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("sms_token")}` },
    });
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student-management-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex bg-orange-50 dark:bg-forest-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} onExport={handleExport} />
        <div className="fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
