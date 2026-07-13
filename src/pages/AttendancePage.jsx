import { useEffect, useState, useMemo } from "react";
import { studentsApi, classesApi, attendanceApi } from "../api/endpoints";
import StatusBadge from "../components/StatusBadge";
import Icon from "../components/Icon";

/*
  AttendancePage — used by both Admin (/admin/attendance) and
  embedded inside TeacherDashboard via embedded={true}.
  When embedded=true the outer padding is removed so the parent
  layout controls spacing.
*/
export default function AttendancePage({ embedded = false }) {
  // ── Mark-attendance state ────────────────────────────────────────────
  const [date, setDate]           = useState("");
  const [classId, setClassId]     = useState("");
  const [studentId, setStudentId] = useState("");
  const [status, setStatus]       = useState("Present");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage]     = useState({ text: "", ok: true });

  // ── Edit state ───────────────────────────────────────────────────────
  const [editRecord, setEditRecord]   = useState(null);
  const [editStatus, setEditStatus]   = useState("Present");
  const [editSaving, setEditSaving]   = useState(false);

  // ── History filter state ─────────────────────────────────────────────
  const [historySearch, setHistorySearch] = useState("");

  // ── Reference data ───────────────────────────────────────────────────
  const [classes, setClasses]           = useState([]);
  const [allStudents, setAllStudents]   = useState([]);
  const [allAttendance, setAllAttendance] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([classesApi.getAll(), studentsApi.getAll(), attendanceApi.getAll()])
      .then(([cRes, sRes, aRes]) => {
        setClasses(cRes.data);
        setAllStudents(sRes.data);
        setAllAttendance(aRes.data);
        setLoading(false);
      });
  }, []);

  const refreshAttendance = () =>
    attendanceApi.getAll().then((r) => setAllAttendance(r.data));

  useEffect(() => { setStudentId(""); setMessage({ text: "", ok: true }); }, [date, classId]);

  const toDate = (v) => (v ? String(v).slice(0, 10) : "");

  // Students in selected class not yet marked for selected date
  const remainingStudents = useMemo(() => {
    if (!date || !classId) return [];
    const markedIds = new Set(
      allAttendance
        .filter((a) => String(a.classId) === String(classId) && toDate(a.attendanceDate) === date)
        .map((a) => a.studentId)
    );
    return allStudents.filter(
      (s) => String(s.classId) === String(classId) && !markedIds.has(s.studentId)
    );
  }, [allStudents, allAttendance, date, classId]);

  const markedRecords = useMemo(() =>
    allAttendance.filter(
      (a) => String(a.classId) === String(classId) && toDate(a.attendanceDate) === date
    ), [allAttendance, date, classId]);

  const totalInClass = allStudents.filter((s) => String(s.classId) === String(classId)).length;
  const allDone = classId && date && totalInClass > 0 && remainingStudents.length === 0;

  // ── Full history — all records grouped by date (newest first) ────────
  const historyGroups = useMemo(() => {
    let records = [...allAttendance];
    if (historySearch.trim()) {
      const q = historySearch.toLowerCase();
      records = records.filter((a) =>
        (a.studentName || "").toLowerCase().includes(q) ||
        (a.className || "").toLowerCase().includes(q) ||
        (a.status || "").toLowerCase().includes(q)
      );
    }
    const grouped = {};
    records.forEach((a) => {
      const d = toDate(a.attendanceDate);
      if (!grouped[d]) grouped[d] = [];
      grouped[d].push(a);
    });
    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)); // newest first
  }, [allAttendance, historySearch]);

  // ── Mark attendance submit ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !classId || !studentId) {
      setMessage({ text: "Please complete all fields.", ok: false });
      return;
    }
    setSubmitting(true);
    setMessage({ text: "", ok: true });
    try {
      await attendanceApi.create({
        studentId: Number(studentId),
        classId: Number(classId),
        attendanceDate: date,
        status,
      });
      await refreshAttendance();
      const name = allStudents.find((s) => s.studentId === Number(studentId))?.fullName ?? "Student";
      setStudentId("");
      setMessage({ text: `✓ ${name} marked as ${status}.`, ok: true });
    } catch (err) {
      setMessage({ text: err.response?.data || "Could not save attendance.", ok: false });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Edit save ──────────────────────────────────────────────────────────
  const handleEditSave = async () => {
    setEditSaving(true);
    try {
      await attendanceApi.update(editRecord.attendanceId, {
        ...editRecord,
        status: editStatus,
      });
      await refreshAttendance();
      setEditRecord(null);
    } catch (err) {
      alert(err.response?.data || "Could not update attendance.");
    } finally {
      setEditSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm("Remove this attendance record?")) return;
    try {
      await attendanceApi.remove(id);
      await refreshAttendance();
    } catch {
      alert("Could not delete.");
    }
  };

  if (loading)
    return <div className={`${embedded ? "p-4" : "p-8"} text-sm text-gray-400 animate-pulse`}>Loading attendance data…</div>;

  const wrap = embedded ? "space-y-6" : "p-5 lg:p-8 space-y-6 fade-in";

  return (
    <div className={wrap}>

      {/* ── Mark Attendance Card ───────────────────────────────────── */}
      <div className="bg-white dark:bg-forest-900 rounded-2xl border border-orange-100 dark:border-forest-800 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-forest-900 to-forest-800 px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
            <Icon name="attendance" className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <p className="text-forest-400 text-xs uppercase tracking-wider font-semibold">Step by step</p>
            <h2 className="font-display font-bold text-white text-lg">Mark Attendance</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Progress pills */}
          <div className="flex items-center gap-2 text-xs">
            {[["1 Date", !!date], ["2 Class", !!classId], ["3 Student & Status", !!studentId]].map(([label, done], i) => (
              <span key={i} className={`px-2.5 py-1 rounded-full font-semibold ${
                done ? "bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300"
                     : i === 0 || (i === 1 && date) || (i === 2 && classId && date)
                       ? "bg-orange-100 dark:bg-orange-900/30 text-brand-700 dark:text-brand-400"
                       : "bg-gray-100 dark:bg-forest-800 text-gray-400"
              }`}>{label}</span>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Step 1 */}
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 block">
                Step 1 — Date <span className="text-red-400">*</span>
              </label>
              <input type="date" value={date}
                onChange={(e) => { setDate(e.target.value); setClassId(""); }}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-forest-700 bg-white dark:bg-forest-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Step 2 */}
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 block">
                Step 2 — Class <span className="text-red-400">*</span>
              </label>
              <select value={classId} onChange={(e) => setClassId(e.target.value)} disabled={!date}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-forest-700 bg-white dark:bg-forest-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50">
                <option value="">{date ? "— Select class —" : "Select a date first"}</option>
                {classes.map((c) => <option key={c.classId} value={c.classId}>{c.className} - {c.section}</option>)}
              </select>
            </div>

            {/* Step 3 — Student */}
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 block">
                Step 3 — Student <span className="text-red-400">*</span>
              </label>
              {allDone ? (
                <div className="w-full px-4 py-2.5 rounded-xl border border-forest-300 dark:border-forest-700 bg-forest-50 dark:bg-forest-950 text-forest-700 dark:text-forest-400 text-sm font-medium">
                  ✓ All students marked for this date
                </div>
              ) : (
                <select value={studentId} onChange={(e) => setStudentId(e.target.value)} disabled={!classId || !date}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-forest-700 bg-white dark:bg-forest-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50">
                  <option value="">{classId ? `${remainingStudents.length} student(s) remaining` : "Select class first"}</option>
                  {remainingStudents.map((s) => <option key={s.studentId} value={s.studentId}>{s.fullName}</option>)}
                </select>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 block">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={!studentId}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-forest-700 bg-white dark:bg-forest-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50">
                <option>Present</option>
                <option>Absent</option>
                <option>Late</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button type="submit" disabled={submitting || !studentId || !classId || !date || allDone}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition">
              {submitting ? "Saving…" : "Save Attendance →"}
            </button>
            {message.text && (
              <p className={`text-sm font-medium ${message.ok ? "text-forest-600 dark:text-forest-400" : "text-red-500"}`}>
                {message.text}
              </p>
            )}
            {classId && date && (
              <span className="ml-auto text-xs text-gray-400">
                {markedRecords.length} / {totalInClass} marked today
              </span>
            )}
          </div>
        </form>

        {/* Today's records for selected class+date */}
        {markedRecords.length > 0 && (
          <div className="border-t border-orange-100 dark:border-forest-800">
            <div className="px-6 py-3 bg-orange-50/60 dark:bg-forest-950/50 flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {date} — {classes.find((c) => String(c.classId) === String(classId))?.className ?? ""}
              </p>
              <span className="text-xs text-gray-400">{markedRecords.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase">
                    <th className="py-2 px-6">Student</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {markedRecords.map((a) => (
                    <tr key={a.attendanceId} className="border-t border-orange-50 dark:border-forest-800/60 hover:bg-orange-50/30 dark:hover:bg-forest-800/20 transition">
                      <td className="py-2.5 px-6 font-medium text-forest-900 dark:text-gray-200">{a.studentName}</td>
                      <td className="py-2.5 px-4"><StatusBadge status={a.status} /></td>
                      <td className="py-2.5 px-4 text-right">
                        {/* Edit button */}
                        <button onClick={() => { setEditRecord(a); setEditStatus(a.status); }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-forest-700 dark:text-forest-300 hover:bg-forest-100 dark:hover:bg-forest-800 transition mr-1">
                          <Icon name="edit" className="w-4 h-4" />
                        </button>
                        {/* Delete button */}
                        <button onClick={() => handleDelete(a.attendanceId)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition">
                          <Icon name="trash" className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Full Attendance History ────────────────────────────────── */}
      <div className="bg-white dark:bg-forest-900 rounded-2xl border border-orange-100 dark:border-forest-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-orange-100 dark:border-forest-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display font-bold text-forest-900 dark:text-white">Attendance History</p>
            <p className="text-xs text-gray-400 mt-0.5">{allAttendance.length} total records</p>
          </div>
          {/* History search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon name="search" className="w-4 h-4" />
            </span>
            <input
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Search records…"
              className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-forest-700 bg-orange-50/40 dark:bg-forest-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-52"
            />
          </div>
        </div>

        {/* Scrollable history grouped by date */}
        <div className="overflow-y-auto max-h-[500px]">
          {historyGroups.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">No attendance records found.</p>
          ) : (
            historyGroups.map(([groupDate, records]) => (
              <div key={groupDate}>
                {/* Date header */}
                <div className="sticky top-0 z-10 px-6 py-2 bg-orange-50 dark:bg-forest-950 border-y border-orange-100 dark:border-forest-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-800 dark:text-white uppercase tracking-wider">
                    📅 {new Date(groupDate + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </span>
                  <span className="text-xs text-gray-400">{records.length} record(s)</span>
                </div>

                <table className="w-full text-sm">
                  <tbody>
                    {records.map((a) => (
                      <tr key={a.attendanceId} className="border-b border-orange-50 dark:border-forest-800/40 hover:bg-orange-50/30 dark:hover:bg-forest-800/20 transition">
                        <td className="py-2.5 px-6 font-medium text-forest-900 dark:text-gray-200 w-1/3">{a.studentName}</td>
                        <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400 text-xs w-1/3">{a.className}</td>
                        <td className="py-2.5 px-4 w-24"><StatusBadge status={a.status} /></td>
                        <td className="py-2.5 px-4 text-right">
                          <button onClick={() => { setEditRecord(a); setEditStatus(a.status); }}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-forest-600 dark:text-forest-400 hover:bg-forest-100 dark:hover:bg-forest-800 transition mr-1">
                            <Icon name="edit" className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(a.attendanceId)}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition">
                            <Icon name="trash" className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Edit Modal ─────────────────────────────────────────────── */}
      {editRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setEditRecord(null)}>
          <div className="bg-white dark:bg-forest-900 rounded-2xl shadow-2xl w-full max-w-sm scale-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-forest-900 to-forest-800 rounded-t-2xl px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-forest-400 text-xs">Edit attendance</p>
                <h3 className="font-display font-bold text-white">{editRecord.studentName}</h3>
                <p className="text-forest-400 text-xs mt-0.5">{toDate(editRecord.attendanceDate)} · {editRecord.className}</p>
              </div>
              <button onClick={() => setEditRecord(null)} className="text-forest-400 hover:text-white transition">
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 block">
                  Update Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Present", "Absent", "Late"].map((s) => (
                    <button key={s} type="button" onClick={() => setEditStatus(s)}
                      className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition ${
                        editStatus === s
                          ? s === "Present" ? "border-forest-600 bg-forest-600 text-white"
                            : s === "Absent" ? "border-red-500 bg-red-500 text-white"
                            : "border-brand-500 bg-brand-500 text-white"
                          : "border-gray-200 dark:border-forest-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-forest-600"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditRecord(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-forest-700 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-forest-800 transition">
                  Cancel
                </button>
                <button onClick={handleEditSave} disabled={editSaving}
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold text-sm transition">
                  {editSaving ? "Saving…" : "Save Change"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
