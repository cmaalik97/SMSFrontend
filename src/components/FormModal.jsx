import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { usersApi } from "../api/endpoints";

// ── Input class shared by every field ──────────────────────────────────────
// text-gray-900 dark:text-white makes typed text readable in dark mode.
const INPUT = `w-full px-4 py-2.5 rounded-xl
  border border-gray-200 dark:border-forest-700
  bg-white dark:bg-forest-950
  text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600
  text-sm focus:outline-none focus:ring-2 focus:ring-brand-500
  disabled:opacity-50 disabled:cursor-not-allowed
  transition`;

export default function FormModal({ open, mode, title, fields, defaultValues, onClose, onSave }) {
  const {
    register, handleSubmit, reset, watch, setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  const [userOptions, setUserOptions]     = useState([]);
  const [remoteData, setRemoteData]       = useState({});
  const [remoteOptions, setRemoteOptions] = useState({});

  const userSelectField    = fields.find((f) => f.type === "userSelect");
  const remoteSelectFields = fields.filter((f) => f.type === "remoteSelect");

  // Load userSelect (available login accounts for this role)
  useEffect(() => {
    if (!open || !userSelectField) return;
    Promise.all([usersApi.getAll(), userSelectField.profileApi.getAll()])
      .then(([uRes, pRes]) => {
        const usedIds = new Set(
          pRes.data
            .filter((p) => p[userSelectField.profileIdKey || "userId"] !== defaultValues?.userId)
            .map((p) => p[userSelectField.profileIdKey || "userId"])
        );
        setUserOptions(uRes.data.filter((u) => u.roleName === userSelectField.role && !usedIds.has(u.userId)));
      });
  }, [open, userSelectField, defaultValues]); // eslint-disable-line

  // Load remoteSelect dropdowns (classes, students, teachers, subjects)
  useEffect(() => {
    if (!open || remoteSelectFields.length === 0) return;
    remoteSelectFields.forEach((f) => {
      f.optionsApi.getAll().then((res) => {
        setRemoteData((p) => ({ ...p, [f.key]: res.data }));
        setRemoteOptions((p) => ({ ...p, [f.key]: res.data.map((item) => ({ value: item[f.valueKey], label: f.labelFn(item) })) }));
      });
    });
  }, [open]); // eslint-disable-line

  // Reset on open
  useEffect(() => { if (open) reset(defaultValues || {}); }, [open, defaultValues, reset]);

  const watchedValues = watch();

  // Auto-fill name/email when a login account is chosen from userSelect (#6)
  useEffect(() => {
    if (!userSelectField) return;
    const id = Number(watchedValues[userSelectField.key]);
    const user = userOptions.find((u) => u.userId === id);
    if (user) { setValue("fullName", user.fullName); setValue("email", user.email); }
  }, [watchedValues[userSelectField?.key]]); // eslint-disable-line

  // Auto-fill class when a student is selected in Attendance (#9C)
  const studentField = fields.find((f) => f.key === "studentId" && f.autoFillTarget);
  useEffect(() => {
    if (!studentField) return;
    const id = Number(watchedValues["studentId"]);
    const s = (remoteData["studentId"] || []).find((r) => r.studentId === id);
    if (s) Object.entries(studentField.autoFillTarget).forEach(([k, v]) => setValue(k, s[v]));
  }, [watchedValues["studentId"]]); // eslint-disable-line

  // Auto maxMarks + auto grade for Results (#7)
  useEffect(() => {
    if (!fields.find((f) => f.key === "examType")) return;
    const maxMap = { Quiz: 10, Midterm: 40, Final: 100 };
    const m = maxMap[watchedValues["examType"]];
    if (m !== undefined) setValue("maxMarks", m);
  }, [watchedValues["examType"]]); // eslint-disable-line

  useEffect(() => {
    if (!fields.find((f) => f.key === "marks")) return;
    const marks = Number(watchedValues["marks"] || 0);
    const max   = Number(watchedValues["maxMarks"] || 100);
    if (!max) return;
    const pct   = (marks / max) * 100;
    setValue("grade", pct >= 90 ? "A" : pct >= 75 ? "B" : pct >= 60 ? "C" : pct >= 45 ? "D" : "F");
  }, [watchedValues["marks"], watchedValues["maxMarks"]]); // eslint-disable-line

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start pt-12 sm:items-center sm:pt-0 p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-forest-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[86vh] flex flex-col mx-auto scale-in">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-forest-900 to-forest-800 rounded-t-2xl px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600/25 border border-brand-500/30 flex items-center justify-center">
              <span className="text-brand-400 font-display font-bold text-sm">
                {mode === "add" ? "+" : "✎"}
              </span>
            </div>
            <div>
              <p className="text-forest-400 text-[11px] uppercase tracking-wider font-semibold">
                {mode === "add" ? "New record" : "Edit record"}
              </p>
              <h3 className="font-display font-bold text-white text-lg leading-tight">{title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-forest-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Fields ──────────────────────────────────────────── */}
        <form onSubmit={handleSubmit(async (data) => { await onSave(data); })} autoComplete="off" className="flex flex-col flex-1 min-h-0">
          {/* AUTOFILL FIX (#1): Hidden honeypot fields absorb browser autofill
              before it reaches the real inputs. Chrome fills the first matching
              inputs it finds — these hidden ones — and leaves the real ones empty. */}
          <div aria-hidden="true" style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0, overflow: "hidden" }}>
            <input type="text" name={`fake_user_${title}`} tabIndex={-1} autoComplete="username" readOnly />
            <input type="password" name={`fake_pass_${title}`} tabIndex={-1} autoComplete="current-password" readOnly />
          </div>
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
            {fields.map((f) => {
              const hasError = !!errors[f.key];
              const borderClass = hasError ? "border-red-400 dark:border-red-500 focus:ring-red-400" : "";
              const fieldInput = INPUT + (borderClass ? ` ${borderClass}` : "");

              return (
                <div key={f.key}>
                  <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                    {f.label}
                    {f.rules?.required && <span className="text-red-400">*</span>}
                    {f.readOnly && <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 font-medium">auto</span>}
                  </label>

                  {f.type === "select" ? (
                    <select {...register(f.key, f.rules)} autoComplete="off" className={fieldInput}>
                      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>

                  ) : f.type === "userSelect" ? (
                    <>
                      <select {...register(f.key, f.rules)} autoComplete="off" className={fieldInput}>
                        <option value="">— Choose a {f.role} login —</option>
                        {userOptions.map((u) => (
                          <option key={u.userId} value={u.userId}>{u.fullName} · {u.email}</option>
                        ))}
                      </select>
                      {userOptions.length === 0 && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1">
                          ⚠ No available {f.role} accounts. Create one in Users first.
                        </p>
                      )}
                    </>

                  ) : f.type === "remoteSelect" ? (
                    <select {...register(f.key, f.rules)} autoComplete="off" disabled={f.readOnly} className={fieldInput}>
                      <option value="">{f.placeholder || "— Select —"}</option>
                      {(remoteOptions[f.key] || []).map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>

                  ) : (
                    <input
                      type={f.type}
                      step={f.type === "number" ? "any" : undefined}
                      autoComplete="off"
                      readOnly={f.readOnly}
                      {...register(f.key, f.rules)}
                      className={fieldInput}
                    />
                  )}

                  {hasError && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <span>⚠</span> {errors[f.key].message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Footer buttons ──────────────────────────────────── */}
          <div className="px-6 py-4 border-t border-orange-100 dark:border-forest-800 flex gap-3 shrink-0 rounded-b-2xl">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-forest-700 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-forest-800 transition">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold text-sm shadow-md shadow-brand-900/30 transition">
              {isSubmitting ? "Saving…" : `Save ${title}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
