const MAP = {
  Present: "bg-forest-100 text-forest-700 dark:bg-forest-800 dark:text-forest-300",
  Paid: "bg-forest-100 text-forest-700 dark:bg-forest-800 dark:text-forest-300",
  Active: "bg-forest-100 text-forest-700 dark:bg-forest-800 dark:text-forest-300",
  Absent: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Unpaid: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Inactive: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Late: "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
  Partial: "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${MAP[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
