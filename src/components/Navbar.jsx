import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Icon from "./Icon";

export default function Navbar() {
  const { dark, toggleDark } = useTheme();
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `px-3 py-2 text-sm font-semibold rounded-lg transition ${
      pathname === path
        ? "text-brand-600 dark:text-brand-400"
        : "text-forest-900/70 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400"
    }`;

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-orange-50/90 dark:bg-forest-950/90 border-b border-orange-200/60 dark:border-forest-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-900/20 shrink-0">
            <span className="text-white font-display font-extrabold text-sm">SM</span>
          </div>
          <div className="leading-tight hidden sm:block">
            <p className="font-display font-bold text-forest-900 dark:text-white text-[15px]">Student Management</p>
            <p className="text-[11px] uppercase tracking-wider text-brand-600 dark:text-brand-400 font-semibold">System</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className={linkClass("/")}>Home</Link>
          <Link to="/about" className={linkClass("/about")}>About</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-forest-800 dark:text-brand-300 hover:bg-orange-100 dark:hover:bg-forest-800 transition"
          >
            <Icon name={dark ? "sun" : "moon"} />
          </button>
          <Link to="/signin" className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-forest-800 dark:text-gray-200 hover:text-brand-600 transition">
            Sign In
          </Link>
          <Link to="/signup" className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm shadow-brand-600/30 transition">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
