import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Icon from "./Icon";

export default function DashboardHeader({ title }) {
  const { user, logout } = useAuth();
  const { dark, toggleDark } = useTheme();

  return (
    <div className="sticky top-0 z-20 h-16 flex items-center justify-between gap-3 px-5 lg:px-8 bg-white/90 dark:bg-forest-900/90 backdrop-blur border-b border-orange-100 dark:border-forest-800">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
          <span className="text-white font-display font-extrabold text-sm">SM</span>
        </div>
        <h1 className="font-display text-lg font-bold text-forest-900 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toggleDark} className="w-9 h-9 rounded-lg flex items-center justify-center text-forest-800 dark:text-brand-300 hover:bg-orange-100 dark:hover:bg-forest-800 transition">
          <Icon name={dark ? "sun" : "moon"} />
        </button>
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-orange-100 dark:border-forest-800">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
            {user?.fullName?.charAt(0)}
          </div>
          <span className="text-sm font-semibold text-forest-900 dark:text-white">{user?.fullName}</span>
        </div>
        <button onClick={logout} className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-forest-800 hover:bg-forest-700 text-white text-sm font-semibold transition">
          <Icon name="logout" className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}
