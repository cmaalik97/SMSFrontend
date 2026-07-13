import { Link } from "react-router-dom";
import Icon from "../components/Icon";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950" />
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-brand-600/30 rounded-full blur-3xl" />
        <div className="absolute -left-20 bottom-0 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="fade-in">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-6">
              Built for modern schools
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
              One calm place to run <span className="text-brand-400">every classroom</span>, every record, every result.
            </h1>
            <p className="text-forest-200 text-lg leading-relaxed mb-8 max-w-md">
              Students, teachers, attendance, fees and results — tracked in one dashboard so admins, teachers and students each see exactly what matters to them.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/signup" className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-900/40 transition">
                Get started — Sign Up
              </Link>
              <Link to="/about" className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold border border-white/15 transition">
                Learn more
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-10">
              <div><p className="text-2xl font-display font-extrabold text-white">1,240+</p><p className="text-xs text-forest-300">Students tracked</p></div>
              <div className="w-px h-8 bg-white/15" />
              <div><p className="text-2xl font-display font-extrabold text-white">98%</p><p className="text-xs text-forest-300">Attendance accuracy</p></div>
              <div className="w-px h-8 bg-white/15" />
              <div><p className="text-2xl font-display font-extrabold text-white">42</p><p className="text-xs text-forest-300">Classes managed</p></div>
            </div>
          </div>

          <div className="relative fade-in">
            <div className="rounded-2xl bg-white/95 dark:bg-forest-900/90 backdrop-blur shadow-2xl p-5 rotate-1 hover:rotate-0 transition duration-500">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="rounded-xl w-full h-64 object-cover"
                alt="Students collaborating in a classroom"
              />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-forest-900 dark:text-white"></p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">28 students · Room 201</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300 text-xs font-semibold">96% present</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-forest-900 rounded-xl shadow-xl p-4 w-44 hidden sm:block">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fees collected</p>
              <p className="text-xl font-display font-extrabold text-brand-600">$48,300</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-brand-600 dark:text-brand-400 font-semibold text-xs uppercase tracking-wider mb-2">Everything in one place</p>
          <h2 className="font-display text-3xl font-extrabold text-forest-900 dark:text-white">Built around the people who use it</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["students", "For Students", "See your attendance, exam results, and fee balance the moment you log in."],
            ["teachers", "For Teachers", "Manage your subjects, mark attendance, and track your classes and salary."],
            ["dash", "For Admins", "Full control — add, edit and remove students, teachers and every record."],
          ].map(([icon, t, d]) => (
            <div key={t} className="p-7 rounded-2xl bg-white dark:bg-forest-900 border border-orange-100 dark:border-forest-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition">
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                <Icon name={icon} className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-forest-900 dark:text-white mb-2">{t}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
