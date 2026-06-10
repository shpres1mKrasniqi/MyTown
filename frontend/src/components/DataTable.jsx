import React from "react";
import { Calendar, Info, Check, X, Edit2, Trash2 } from "lucide-react";

export default function DataTable({
  columns = [],
  data = [],
  onStatusUpdate,
  onEdit,
  onDelete,
}) {
  
  // Badges me stil premium minimalist
  const renderStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    
    if (s === "1" || s === "approved" || s === "pranduar") {
      return (
        <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
          Aprovuar
        </span>
      );
    }
    if (s === "2" || s === "rejected" || s === "refuzuar") {
      return (
        <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
          Refuzuar
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
        Në Pritje
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("sq-AL", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const handleAction = async (id, newStatus) => {
    if (onStatusUpdate) {
      onStatusUpdate(id, newStatus);
    } else {
      console.log(`U kërkua ndryshimi i statusit për id: ${id} në ${newStatus}`);
    }
  };

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-slate-400 flex flex-col items-center gap-3 bg-white rounded-xl">
        <Info size={32} className="text-blue-500" />
        <p className="font-semibold text-base text-slate-700">Nuk u gjet asnjë rezultat.</p>
        <p className="text-xs text-slate-400">Provo të ndryshosh filtrat e kërkimit më lart.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#202d60] text-white text-xs font-bold uppercase tracking-wider border-b border-[#162045]">
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4.5 font-bold tracking-wide">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
  <th className="px-6 py-4.5 text-right">
    Veprimet
  </th>
)}
           
          </tr>
        </thead>
        
        <tbody className="divide-y divide-slate-100 text-sm">
          {data.map((row, index) => (
            <tr 
              key={row.id || index} 
              className="hover:bg-blue-50/40 even:bg-slate-50/30 transition-colors duration-150 group"
            >
              {columns.map((col) => {
                const cellValue = row[col.key];

                return (
                  <td key={col.key} className="px-6 py-4.5 text-slate-700 max-w-[300px] truncate align-middle">
                    {col.key === "status" ? (
                      renderStatusBadge(cellValue)
                    ) : col.key === "dateOfMeeting" || col.key === "date" ? (
                      <span className="flex items-center gap-2 text-slate-600 font-semibold text-xs bg-slate-100 px-2.5 py-1 rounded-lg w-fit border border-slate-200/60">
                        <Calendar size={13} className="text-blue-600" />
                        {formatDate(cellValue)}
                      </span>
                    ) : col.key === "title" ? (
                      <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-150 block truncate">
                        {cellValue}
                      </span>
                    ) : (
                      <span className="font-medium text-slate-600">{cellValue || "-"}</span>
                    )}
                  </td>
                );
              })}
{(onEdit || onDelete) && (
  <td className="px-6 py-4.5">
    <div className="flex justify-end gap-2">

      {onEdit && (
        <button
          onClick={() => onEdit(row)}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
        >
          <Edit2 size={16} />
        </button>
      )}

      {onDelete && (
        <button
          onClick={() => onDelete(row)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <Trash2 size={16} />
        </button>
      )}

    </div>
  </td>
)}
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}