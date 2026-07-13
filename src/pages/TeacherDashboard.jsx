import { useEffect, useState } from "react";
import { subjectsApi, teachersApi } from "../api/endpoints";
import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import AttendancePage from "./AttendancePage";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [tab, setTab]         = useState("info");
  const [subjects, setSubjects] = useState([]);
  const [me, setMe]           = useState(null);

  useEffect(() => {
    subjectsApi.getAll().then((r) => setSubjects(r.data));
    teachersApi.getAll().then((r) => setMe(r.data[0]));
  }, []);

  const myClasses = [...new Set(subjects.map((s) => s.className))];

  const tabClass = (name) =>
    `px-5 py-3 text-sm font-semibold border-b-2 transition ${
      tab === name
        ? "border-brand-600 text-brand-600 dark:text-brand-400"
        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-forest-900 dark:hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-forest-950">
      <DashboardHeader title="My Dashboard" />

      {/* ── Tab navigation ──────────────────────────────────── */}
      <div className="bg-white dark:bg-forest-900 border-b border-orange-100 dark:border-forest-800 px-5 lg:px-8">
        <div className="flex">
          <button className={tabClass("info")}     onClick={() => setTab("info")}>My Info</button>
          <button className={tabClass("attendance")} onClick={() => setTab("attendance")}>Attendance</button>
        </div>
      </div>

      {/* ── My Info tab ─────────────────────────────────────── */}
      {tab === "info" && (
        <div className="p-5 lg:p-8 space-y-6 fade-in">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-900 text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-forest-300 text-sm">Welcome back,</p>
              <h2 className="font-display text-2xl font-extrabold">{user?.fullName}</h2>
              <p className="text-forest-300 text-sm mt-1">{me?.qualification}</p>
            </div>
            <div className="text-right">
              <p className="text-forest-300 text-xs uppercase tracking-wide">Monthly Salary</p>
              <p className="text-3xl font-display font-extrabold text-brand-400">
                ${me?.salary?.toLocaleString() ?? "—"}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <StatCard icon="subjects" label="My Subjects" value={subjects.length} sub="This term"
              accent="bg-brand-600/10 text-brand-600 dark:text-brand-400" />
            <StatCard icon="classes" label="My Classes" value={myClasses.length} sub="Active"
              accent="bg-forest-700/10 text-forest-700 dark:text-forest-400" />
            <StatCard icon="teachers" label="Joined"
              value={me ? new Date(me.joiningDate).toLocaleDateString() : "—"} sub="Tenure start"
              accent="bg-brand-600/10 text-brand-600 dark:text-brand-400" />
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-forest-900 border border-orange-100 dark:border-forest-800 shadow-sm">
            <p className="font-display font-bold text-forest-900 dark:text-white mb-4">My Subjects &amp; Classes</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase border-b border-orange-100 dark:border-forest-800">
                  <th className="py-2 pr-4">Subject</th>
                  <th className="py-2 pr-4">Code</th>
                  <th className="py-2">Class</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s) => (
                  <tr key={s.subjectId} className="border-b border-orange-50 dark:border-forest-800/60">
                    <td className="py-2.5 pr-4 font-medium text-forest-900 dark:text-gray-200">{s.subjectName}</td>
                    <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400">{s.subjectCode}</td>
                    <td className="py-2.5 text-gray-500 dark:text-gray-400">{s.className}</td>
                  </tr>
                ))}
                {subjects.length === 0 && (
                  <tr><td colSpan={3} className="py-6 text-center text-gray-400">No subjects assigned yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Attendance tab — same component as Admin, embedded=true ── */}
      {tab === "attendance" && (
        <div className="p-5 lg:p-8 fade-in">
          <AttendancePage embedded={true} />
        </div>
      )}
    </div>
  );
}
