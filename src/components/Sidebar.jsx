import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";

const NAV = [
  ["", "Dashboard", "dash"],
  ["students", "Students", "students"],
  ["teachers", "Teachers", "teachers"],
  ["fees", "Fees", "fees"],
  ["classes", "Classes", "classes"],
  ["results", "Results", "results"],
  ["subjects", "Subjects", "subjects"],
  ["attendance", "Attendance", "attendance"],
  ["users", "Users", "users"],
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      <aside
        className={`${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          fixed lg:sticky top-0 left-0 h-screen w-64 bg-forest-950 border-r border-forest-900
          z-40 flex flex-col transition-transform duration-300`}
      >
        <div className="h-16 flex items-center px-5 border-b border-forest-900 gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <span className="text-white font-display font-extrabold text-sm">SM</span>
          </div>
          <p className="font-display font-bold text-white text-[15px]">Admin Panel</p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV.map(([path, label, icon]) => (
            <NavLink
              key={label}
              to={`/admin/${path}`}
              end={path === ""}
              onClick={onClose}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive ? "bg-brand-600 text-white shadow-md shadow-black/20" : "text-forest-200 hover:bg-forest-800/70"
                }`
              }
            >
              <Icon name={icon} className="w-5 h-5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-3 border-t border-forest-900">
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.fullName?.charAt(0)}
            </div>
            <div className="leading-tight overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-forest-400">{user?.role}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-forest-200 hover:bg-forest-800/70 transition">
            <Icon name="logout" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {open && <div onClick={onClose} className="fixed inset-0 bg-black/50 z-30 lg:hidden" />}
    </>
  );
}
