import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import { ENTITY_CONFIG } from "../config/entities";

// ── Text export formatter ──────────────────────────────────────────────────
function exportAsText(cfg, rows) {
  let text = `STUDENT MANAGEMENT SYSTEM\n`;
  text += `${cfg.title.toUpperCase()} REPORT\n`;
  text += `Generated: ${new Date().toLocaleString()}\n`;
  text += "=".repeat(55) + "\n\n";
  if (rows.length === 0) { text += "No records found.\n"; }
  rows.forEach((row, i) => {
    text += `${i + 1}. `;
    cfg.columns.forEach(([key, label]) => {
      const v = row[key];
      if (v != null && v !== "") text += `${label}: ${v}  `;
    });
    text += "\n";
  });
  text += `\n${"─".repeat(55)}\nTotal: ${rows.length} record(s)\n`;
  return text;
}

function download(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function EntityPage() {
  const { entity } = useParams();
  const location = useLocation();
  const cfg = ENTITY_CONFIG[entity];

  const [allRows, setAllRows] = useState([]);   // ← full dataset from API
  const [firstLoad, setFirstLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);

  // Reset per-page state when entity or route changes (#2 search persists, #5 modal stays open)
  const prevEntity = useRef(entity);
  useEffect(() => {
    if (prevEntity.current !== entity) {
      setSearch(""); setFilter("All"); setModal(null); setFirstLoad(true);
      prevEntity.current = entity;
    }
  }, [entity]);
  useEffect(() => { setModal(null); }, [location.pathname]);

  // ── #1 FIX: Load ALL rows from API — zero params.
  // Search and filter happen instantly in the browser via useMemo below.
  // This means every section works identically regardless of what params
  // the C# controller happens to support.
  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await cfg.api.getAll();   // ← no search/filter params
      setAllRows(res.data);
    } catch (err) {
      console.error("Failed to load", entity, err);
    } finally {
      setRefreshing(false);
      setFirstLoad(false);
    }
  }, [entity]); // ← only re-runs when the entity (page) changes, NOT on every search keystroke
  useEffect(() => { load(); }, [load]);

  // ── #1 FIX: Client-side search + filter — instant, works in EVERY section.
  // Both can be active at the same time without conflict.
  const rows = useMemo(() => {
    let result = allRows;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(q))
      );
    }
    if (filter !== "All" && cfg?.filterKey) {
      result = result.filter((r) => String(r[cfg.filterKey] ?? "") === filter);
    }
    return result;
  }, [allRows, search, filter, cfg?.filterKey]);

  const filterOptions = cfg?.filterOptions ||
    ["All", ...new Set(allRows.map((r) => String(r[cfg?.filterKey])).filter(Boolean))];

  const handleSave = async (data) => {
    try {
      if (modal.mode === "add") await cfg.api.create(data);
      else await cfg.api.update(modal.row[cfg.idKey], data);
      setModal(null);
      load();
    } catch (err) {
      alert(err.response?.data || `Could not save. Please check all fields.`);
    }
  };

  const handleDelete = async (row) => {
    const label = row.fullName || row.className || row.subjectName || `this ${cfg.singular.toLowerCase()}`;
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return;
    try {
      await cfg.api.remove(row[cfg.idKey]);
      load();
    } catch (err) {
      alert(err.response?.data || `Could not delete.`);
    }
  };

  // ── #4 FIX: Export — uses the currently filtered rows, not dashboard data
  const handleExportJSON = () => {
    download(JSON.stringify(rows, null, 2), `${entity}-${Date.now()}.json`, "application/json");
  };
  const handleExportText = () => {
    download(exportAsText(cfg, rows), `${entity}-${Date.now()}.txt`, "text/plain");
  };

  if (!cfg) return <div className="p-8">Unknown table.</div>;

  return (
    <div className="p-5 lg:p-8">
      {/* ── #4 Export buttons — always show current table's own data ── */}
      <div className="flex justify-end gap-2 mb-4">
        <button onClick={handleExportJSON}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold transition">
          ↓ JSON
        </button>
        <button onClick={handleExportText}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-forest-700 hover:bg-forest-600 text-white text-xs font-semibold transition">
          ↓ Text (Word)
        </button>
      </div>

      {firstLoad ? (
        <p className="text-sm text-gray-400 animate-pulse">Loading {cfg.title.toLowerCase()}...</p>
      ) : (
        <DataTable
          columns={cfg.columns}
          rows={rows}
          idKey={cfg.idKey}
          singular={cfg.singular}
          searchPlaceholder={`Search ${cfg.title.toLowerCase()}...`}
          search={search}
          onSearchChange={setSearch}
          filterKey={cfg.filterKey}
          filterOptions={filterOptions}
          filter={filter}
          onFilterChange={setFilter}
          onAdd={() => setModal({ mode: "add", row: {} })}
          onEdit={(row) => setModal({ mode: "edit", row })}
          onDelete={handleDelete}
          refreshing={refreshing}
        />
      )}

      <FormModal
        key={`${entity}-${modal?.mode}-${modal?.row?.[cfg.idKey] ?? "new"}`}
        open={!!modal}
        mode={modal?.mode}
        title={cfg.singular}
        fields={cfg.fields}
        defaultValues={modal?.row}
        onClose={() => setModal(null)}
        onSave={handleSave}
      />
    </div>
  );
}
