import { useTheme } from "../context/ThemeContext";
import Icon from "./Icon";

export default function Topbar({ title, onMenuClick, onExport, showExport = true }) {
  const { dark, toggleDark } = useTheme();

  return (
    <div className="sticky top-0 z-20 h-16 flex items-center justify-between gap-3 px-5 lg:px-8 bg-white/90 dark:bg-forest-900/90 backdrop-blur border-b border-orange-100 dark:border-forest-800">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-forest-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-forest-800">
            <Icon name="menu" />
          </button>
        )}
        <h1 className="font-display text-lg font-bold text-forest-900 dark:text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {showExport && onExport && (
          <button onClick={onExport} className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-forest-800 hover:bg-forest-700 text-white text-sm font-semibold transition">
            <Icon name="export" className="w-4 h-4" /> Export Data
          </button>
        )}
        <button onClick={toggleDark} className="w-9 h-9 rounded-lg flex items-center justify-center text-forest-800 dark:text-brand-300 hover:bg-orange-100 dark:hover:bg-forest-800 transition">
          <Icon name={dark ? "sun" : "moon"} />
        </button>
      </div>
    </div>
  );
}
