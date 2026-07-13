import { useEffect, useState } from "react";
import { dashboardApi, feesApi } from "../api/endpoints";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [recentFees, setRecentFees] = useState([]);

  useEffect(() => {
    dashboardApi.summary().then((res) => setSummary(res.data));
    feesApi.getAll().then((res) => setRecentFees(res.data.slice(0, 5)));
  }, []);

  if (!summary) return <div className="p-8 text-sm text-gray-400 animate-pulse">Loading dashboard…</div>;

  return (
    <div className="p-5 lg:p-8 space-y-6 fade-in">

      {/* ── Row 1: 4 main stats ─────────────────────────────── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="students"   label="Total Students"    value={summary.totalStudents}  sub="Live count"          accent="bg-brand-600/10 text-brand-600 dark:text-brand-400" />
        <StatCard icon="teachers"   label="Total Teachers"    value={summary.totalTeachers}  sub="Active staff"        accent="bg-forest-700/10 text-forest-700 dark:text-forest-400" />
        <StatCard icon="fees"       label="Fees Collected"    value={`$${Number(summary.feesCollected).toLocaleString()}`} sub={`$${Number(summary.feesDue).toLocaleString()} pending`} accent="bg-brand-600/10 text-brand-600 dark:text-brand-400" />
        {/* #5 FIX: Attendance rate card restored ─────────────── */}
        <StatCard icon="attendance" label="Attendance Today"  value={`${summary.attendanceRateToday}%`} sub="Present / marked today" accent="bg-forest-700/10 text-forest-700 dark:text-forest-400" />
      </div>

      {/* ── Row 2: 4 secondary stats ────────────────────────── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="classes"    label="Classes"    value={summary.totalClasses}   sub="Across all grades"   accent="bg-brand-600/10 text-brand-600 dark:text-brand-400" />
        <StatCard icon="subjects"   label="Subjects"   value={summary.totalSubjects}  sub="Offered this term"   accent="bg-forest-700/10 text-forest-700 dark:text-forest-400" />
        <StatCard icon="results"    label="Results Logged" value={summary.totalResults ?? "—"}   sub="This term" accent="bg-brand-600/10 text-brand-600 dark:text-brand-400" />
        <StatCard icon="users"      label="System Users"   value={summary.totalUsers ?? "—"}     sub="All roles" accent="bg-forest-700/10 text-forest-700 dark:text-forest-400" />
      </div>

      {/* ── Recent Fee Activity ──────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-white dark:bg-forest-900 border border-orange-100 dark:border-forest-800 shadow-sm">
        <p className="font-display font-bold text-forest-900 dark:text-white mb-4">Recent Fee Activity</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-orange-100 dark:border-forest-800">
                <th className="py-2 pr-4">Student</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Due</th>
                <th className="py-2 pr-4">Paid</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentFees.map((f) => (
                <tr key={f.feeId} className="border-b border-orange-50 dark:border-forest-800/60 hover:bg-orange-50/40 dark:hover:bg-forest-800/30 transition">
                  <td className="py-2.5 pr-4 font-medium text-forest-900 dark:text-gray-200">{f.studentName}</td>
                  <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400">{f.feeType}</td>
                  <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400">${f.amountDue}</td>
                  <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400">${f.amountPaid}</td>
                  <td className="py-2.5"><StatusBadge status={f.status} /></td>
                </tr>
              ))}
              {recentFees.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">No fee records yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
