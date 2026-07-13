import { useEffect, useState } from "react";
import { attendanceApi, resultsApi, feesApi } from "../api/endpoints";
import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [tab, setTab]           = useState("overview");
  const [attendance, setAttendance] = useState([]);
  const [results, setResults]   = useState([]);
  const [fees, setFees]         = useState([]);

  useEffect(() => {
    // All three APIs are filtered server-side to only return THIS student's records
    attendanceApi.getAll().then((r) => setAttendance(r.data));
    resultsApi.getAll().then((r) => setResults(r.data));
    feesApi.getAll().then((r) => setFees(r.data));
  }, []);

  const toDate = (v) => (v ? String(v).slice(0, 10) : "");

  const totalDue  = fees.reduce((s, f) => s + (f.amountDue  || 0), 0);
  const totalPaid = fees.reduce((s, f) => s + (f.amountPaid || 0), 0);
  const avgMark   = results.length
    ? Math.round(results.reduce((s, r) => s + (r.marks / r.maxMarks) * 100, 0) / results.length)
    : 0;
  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const attRate = attendance.length
    ? Math.round((presentCount / attendance.length) * 100)
    : 100;

  const tabClass = (name) =>
    `px-5 py-3 text-sm font-semibold border-b-2 transition ${
      tab === name
        ? "border-brand-600 text-brand-600 dark:text-brand-400"
        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-forest-900 dark:hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-forest-950">
      <DashboardHeader title="My Dashboard" />

      {/* ── Hero banner ──────────────────────────────────────── */}
      <div className="px-5 lg:px-8 pt-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-brand-100 text-sm">Welcome back,</p>
            <h2 className="font-display text-2xl font-extrabold">{user?.fullName}</h2>
          </div>
          <div className="text-right">
            <p className="text-brand-100 text-xs uppercase tracking-wide">Average Score</p>
            <p className="text-3xl font-display font-extrabold">{avgMark}%</p>
          </div>
        </div>
      </div>

      {/* ── Stat cards ───────────────────────────────────────── */}
      <div className="px-5 lg:px-8 pt-5">
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard icon="attendance" label="Attendance Rate" value={`${attRate}%`}
            sub={`${presentCount} present / ${attendance.length} total`}
            accent="bg-forest-700/10 text-forest-700 dark:text-forest-400" />
          <StatCard icon="fees" label="Fees Paid"
            value={`$${totalPaid} / $${totalDue}`}
            sub={totalDue - totalPaid > 0 ? `$${totalDue - totalPaid} remaining` : "Fully paid"}
            accent="bg-brand-600/10 text-brand-600 dark:text-brand-400" />
          <StatCard icon="results" label="Exams Logged" value={results.length} sub="This term"
            accent="bg-forest-700/10 text-forest-700 dark:text-forest-400" />
        </div>
      </div>

      {/* ── Tab navigation ───────────────────────────────────── */}
      <div className="mt-6 bg-white dark:bg-forest-900 border-b border-orange-100 dark:border-forest-800 px-5 lg:px-8">
        <div className="flex">
          <button className={tabClass("overview")}   onClick={() => setTab("overview")}>Overview</button>
          <button className={tabClass("attendance")} onClick={() => setTab("attendance")}>My Attendance</button>
          <button className={tabClass("results")}    onClick={() => setTab("results")}>My Results</button>
          <button className={tabClass("fees")}       onClick={() => setTab("fees")}>My Fees</button>
        </div>
      </div>

      <div className="px-5 lg:px-8 py-6 fade-in">

        {/* ── Overview tab ─────────────────────────────────── */}
        {tab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-5">
            {/* Recent results */}
            <div className="p-5 rounded-2xl bg-white dark:bg-forest-900 border border-orange-100 dark:border-forest-800 shadow-sm">
              <p className="font-display font-bold text-forest-900 dark:text-white mb-4">Recent Results</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase border-b border-orange-100 dark:border-forest-800">
                    <th className="py-2 pr-4">Subject</th>
                    <th className="py-2 pr-4">Exam</th>
                    <th className="py-2 pr-4">Score</th>
                    <th className="py-2">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 5).map((r) => (
                    <tr key={r.resultId} className="border-b border-orange-50 dark:border-forest-800/60">
                      <td className="py-2.5 pr-4 font-medium text-forest-900 dark:text-gray-200">{r.subjectName}</td>
                      <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400">{r.examType}</td>
                      <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400">{r.marks}/{r.maxMarks}</td>
                      <td className="py-2.5 font-bold text-brand-600 dark:text-brand-400">{r.grade}</td>
                    </tr>
                  ))}
                  {results.length === 0 && (
                    <tr><td colSpan={4} className="py-6 text-center text-gray-400">No results yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Recent fees */}
            <div className="p-5 rounded-2xl bg-white dark:bg-forest-900 border border-orange-100 dark:border-forest-800 shadow-sm">
              <p className="font-display font-bold text-forest-900 dark:text-white mb-4">Fee Summary</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase border-b border-orange-100 dark:border-forest-800">
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Due</th>
                    <th className="py-2 pr-4">Paid</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f) => (
                    <tr key={f.feeId} className="border-b border-orange-50 dark:border-forest-800/60">
                      <td className="py-2.5 pr-4 font-medium text-forest-900 dark:text-gray-200">{f.feeType}</td>
                      <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400">${f.amountDue}</td>
                      <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400">${f.amountPaid}</td>
                      <td className="py-2.5"><StatusBadge status={f.status} /></td>
                    </tr>
                  ))}
                  {fees.length === 0 && (
                    <tr><td colSpan={4} className="py-6 text-center text-gray-400">No fee records yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Attendance tab ───────────────────────────────── */}
        {tab === "attendance" && (
          <div className="space-y-4">
            {/* Summary bar */}
            <div className="grid grid-cols-3 gap-4">
              {[
                ["Present", attendance.filter((a) => a.status === "Present").length, "bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300"],
                ["Absent",  attendance.filter((a) => a.status === "Absent").length,  "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"],
                ["Late",    attendance.filter((a) => a.status === "Late").length,    "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300"],
              ].map(([label, count, cls]) => (
                <div key={label} className={`p-4 rounded-xl text-center ${cls}`}>
                  <p className="text-2xl font-display font-extrabold">{count}</p>
                  <p className="text-xs font-semibold mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Attendance history — sorted newest first */}
            <div className="bg-white dark:bg-forest-900 rounded-2xl border border-orange-100 dark:border-forest-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-orange-100 dark:border-forest-800 flex items-center justify-between">
                <p className="font-display font-bold text-forest-900 dark:text-white">My Attendance History</p>
                <span className="text-xs text-gray-400">{attendance.length} records</span>
              </div>

              <div className="overflow-y-auto max-h-[480px]">
                {attendance.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-10">No attendance records yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-orange-50/90 dark:bg-forest-950/90">
                      <tr className="text-left text-gray-400 text-xs uppercase">
                        <th className="py-3 px-6">Date</th>
                        <th className="py-3 px-4">Class</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...attendance]
                        .sort((a, b) => toDate(b.attendanceDate).localeCompare(toDate(a.attendanceDate)))
                        .map((a) => (
                          <tr key={a.attendanceId} className="border-t border-orange-50 dark:border-forest-800/60 hover:bg-orange-50/30 dark:hover:bg-forest-800/20 transition">
                            <td className="py-3 px-6 font-medium text-forest-900 dark:text-gray-200">
                              {new Date(toDate(a.attendanceDate) + "T00:00:00").toLocaleDateString(undefined, {
                                weekday: "short", year: "numeric", month: "short", day: "numeric",
                              })}
                            </td>
                            <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{a.className}</td>
                            <td className="py-3 px-4"><StatusBadge status={a.status} /></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Results tab ──────────────────────────────────── */}
        {tab === "results" && (
          <div className="bg-white dark:bg-forest-900 rounded-2xl border border-orange-100 dark:border-forest-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-orange-100 dark:border-forest-800">
              <p className="font-display font-bold text-forest-900 dark:text-white">My Exam Results</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase bg-orange-50/60 dark:bg-forest-950/50">
                    <th className="py-3 px-6">Subject</th>
                    <th className="py-3 px-4">Exam Type</th>
                    <th className="py-3 px-4">Marks</th>
                    <th className="py-3 px-4">Max</th>
                    <th className="py-3 px-4">%</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.resultId} className="border-t border-orange-50 dark:border-forest-800/60 hover:bg-orange-50/30 dark:hover:bg-forest-800/20 transition">
                      <td className="py-3 px-6 font-medium text-forest-900 dark:text-gray-200">{r.subjectName}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{r.examType}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">{r.marks}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{r.maxMarks}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                        {Math.round((r.marks / r.maxMarks) * 100)}%
                      </td>
                      <td className="py-3 px-4 font-bold text-brand-600 dark:text-brand-400">{r.grade}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{toDate(r.examDate)}</td>
                    </tr>
                  ))}
                  {results.length === 0 && (
                    <tr><td colSpan={7} className="py-10 text-center text-gray-400">No results yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Fees tab ─────────────────────────────────────── */}
        {tab === "fees" && (
          <div className="space-y-4">
            {/* Totals */}
            <div className="grid grid-cols-3 gap-4">
              {[
                ["Total Due",  `$${totalDue}`,  "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"],
                ["Total Paid", `$${totalPaid}`, "bg-forest-50 dark:bg-forest-800/40 text-forest-700 dark:text-forest-300"],
                ["Balance",    `$${totalDue - totalPaid}`, totalDue - totalPaid > 0 ? "bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300" : "bg-forest-50 dark:bg-forest-800/40 text-forest-700 dark:text-forest-300"],
              ].map(([label, val, cls]) => (
                <div key={label} className={`p-4 rounded-xl text-center ${cls}`}>
                  <p className="text-xl font-display font-extrabold">{val}</p>
                  <p className="text-xs font-semibold mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-forest-900 rounded-2xl border border-orange-100 dark:border-forest-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-orange-100 dark:border-forest-800">
                <p className="font-display font-bold text-forest-900 dark:text-white">My Fee Records</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase bg-orange-50/60 dark:bg-forest-950/50">
                    <th className="py-3 px-6">Type</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Amount Due</th>
                    <th className="py-3 px-4">Amount Paid</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f) => (
                    <tr key={f.feeId} className="border-t border-orange-50 dark:border-forest-800/60">
                      <td className="py-3 px-6 font-medium text-forest-900 dark:text-gray-200">{f.feeType}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{toDate(f.dueDate)}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">${f.amountDue}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">${f.amountPaid}</td>
                      <td className="py-3 px-4"><StatusBadge status={f.status} /></td>
                    </tr>
                  ))}
                  {fees.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-400">No fee records yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
