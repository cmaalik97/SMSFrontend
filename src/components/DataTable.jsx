import { useState } from "react";
import Icon from "./Icon";
import StatusBadge from "./StatusBadge";

export default function DataTable({ columns, rows, idKey, onAdd, onEdit, onDelete, searchPlaceholder, filterKey, filterOptions, filter, onFilterChange, search, onSearchChange, singular, refreshing }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon name="search" className="w-4 h-4" />
            </span>
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 dark:border-forest-700 bg-white dark:bg-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {filterKey && (
            <select
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-gray-200 dark:border-forest-700 bg-white dark:bg-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {filterOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          )}
        </div>

        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm shadow-brand-600/30 transition">
          <Icon name="plus" className="w-4 h-4" /> Add {singular}
        </button>
      </div>

      <div className="bg-white dark:bg-forest-900 border border-orange-100 dark:border-forest-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wide bg-orange-50/60 dark:bg-forest-950/50">
                {columns.map(([, label]) => <th key={label} className="py-3 px-4 font-semibold whitespace-nowrap">{label}</th>)}
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={columns.length + 1} className="py-10 text-center text-gray-400">No records found.</td></tr>
              )}
              {rows.map((row) => (
                <tr key={row[idKey]} className="border-t border-orange-50 dark:border-forest-800/60 hover:bg-orange-50/40 dark:hover:bg-forest-800/30 transition">
                  {columns.map(([key]) => (
                    <td key={key} className="py-3 px-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {key.toLowerCase() === "status" ? <StatusBadge status={row[key]} /> : row[key]}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button onClick={() => onEdit(row)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-forest-700 dark:text-forest-300 hover:bg-forest-100 dark:hover:bg-forest-800 transition mr-1">
                      <Icon name="edit" className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(row)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition">
                      <Icon name="trash" className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-gray-400">{rows.length} record(s){refreshing && <span className="ml-2 text-brand-500">Refreshing...</span>}</p>
    </div>
  );
}
