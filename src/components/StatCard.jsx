import Icon from "./Icon";

export default function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-forest-900 border border-orange-100 dark:border-forest-800 shadow-sm hover:shadow-md transition">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon name={icon} className="w-5.5 h-5.5" />
      </div>
      <p className="text-2xl font-display font-extrabold text-forest-900 dark:text-white mt-4">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-xs text-forest-600 dark:text-brand-400 font-semibold mt-1">{sub}</p>
    </div>
  );
}
