import { Link } from "react-router-dom";

export default function About() {
  const cards = [
    ["Role-based access", "Every account is either an Admin, Teacher or Student, and the dashboard reshapes itself around that role."],
    ["Live records", "Attendance, results and fee payments update instantly across every linked table."],
    ["Built to scale", "From a single classroom to a multi-campus school, the same 9 tables hold everything."],
    ["Secure by design", "Sign up is reserved for administrators; teacher and student accounts are issued by an admin."],
  ];

  return (
    <section className="max-w-4xl mx-auto px-6 py-20 fade-in">
      <p className="text-brand-600 dark:text-brand-400 font-semibold text-xs uppercase tracking-wider mb-2">About the system</p>
      <h1 className="font-display text-3xl md:text-4xl font-extrabold text-forest-900 dark:text-white mb-6">
        A single source of truth for the whole school.
      </h1>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
        The Student Management System brings admissions, attendance, grading and fee collection into one
        role-aware dashboard. Administrators get full oversight; teachers see only their own classes and
        subjects; students see only their own attendance, results and fee balance — nothing more, nothing less.
      </p>
      <div className="grid sm:grid-cols-2 gap-5 my-10">
        {cards.map(([t, d]) => (
          <div key={t} className="p-5 rounded-xl bg-forest-50 dark:bg-forest-900 border border-forest-100 dark:border-forest-800">
            <p className="font-display font-bold text-forest-900 dark:text-white mb-1.5">{t}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{d}</p>
          </div>
        ))}
      </div>
      <Link to="/signup" className="inline-block px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-sm transition">
        Create your admin account
      </Link>
    </section>
  );
}
