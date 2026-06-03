import { useState, useRef } from "react";
import { Download, Upload, FileSpreadsheet, FileText, FileJson, Loader2, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { dataExchangeService } from "../services/dataExchangeService";

const ENTITY_LABELS = {
  issues: "Issues",
  proposals: "Project Proposals",
  events: "Events",
  meetings: "Meeting Requests",
  "construction-permits": "Construction Permits",
};

function DataExchangeToolbar({ entityType, onImportSuccess }) {
  const [exporting, setExporting] = useState(null);
  const [importing, setImporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = useRef(null);

  const entityLabel = ENTITY_LABELS[entityType] || entityType;

  const handleExport = async (format) => {
    setExporting(format);
    setShowExportMenu(false);
    try {
      const res = await dataExchangeService.exportData(entityType, format);
      const blob = new Blob([res.data]);
      const ext = format === "excel" ? "xlsx" : format;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${entityType}_${new Date().toISOString().slice(0, 10)}.${ext}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`${entityLabel} u eksportuan në ${format.toUpperCase()} me sukses`);
    } catch (err) {
      console.error(err);
      toast.error(`Gabim gjatë eksportimit: ${err.response?.data || err.message}`);
    } finally {
      setExporting(null);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Detect format from extension
    const ext = file.name.split(".").pop()?.toLowerCase();
    let format;
    if (ext === "csv") format = "csv";
    else if (ext === "xlsx" || ext === "xls") format = "excel";
    else if (ext === "json") format = "json";
    else {
      toast.error("Format i pambështetur. Përdorni CSV, Excel (.xlsx) ose JSON.");
      fileInputRef.current.value = "";
      return;
    }

    setImporting(true);
    try {
      const res = await dataExchangeService.importData(entityType, format, file);
      const result = res.data;
      if (result.errorCount > 0) {
        toast.warn(
          `Importimi përfundoi: ${result.successCount}/${result.totalRows} me sukses, ${result.errorCount} gabime`
        );
      } else {
        toast.success(
          `${result.successCount} rreshta u importuan me sukses!`
        );
      }
      if (onImportSuccess) onImportSuccess();
    } catch (err) {
      console.error(err);
      toast.error(`Gabim gjatë importimit: ${err.response?.data || err.message}`);
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Export Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          disabled={exporting !== null}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60 shadow-sm"
        >
          {exporting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          Eksporto
          <ChevronDown size={14} />
        </button>

        {showExportMenu && (
          <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <button
              onClick={() => handleExport("csv")}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FileText size={16} className="text-green-600" />
              Eksporto CSV
            </button>
            <button
              onClick={() => handleExport("excel")}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FileSpreadsheet size={16} className="text-emerald-600" />
              Eksporto Excel
            </button>
            <button
              onClick={() => handleExport("json")}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FileJson size={16} className="text-blue-600" />
              Eksporto JSON
            </button>
          </div>
        )}
      </div>

      {/* Import Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={importing}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 shadow-sm"
      >
        {importing ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Upload size={16} />
        )}
        Importo
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls,.json"
        onChange={handleImport}
        className="hidden"
      />

      {/* Close dropdown on outside click */}
      {showExportMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </div>
  );
}

export default DataExchangeToolbar;
