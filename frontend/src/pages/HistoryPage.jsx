import { useEffect, useState } from "react";
import { historyService } from "../services/historyService";
import { Download, Calendar, MapPin, Search, FileText, Clock, AlertCircle } from "lucide-react";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchHistory = async () => {
    try {
      const res = await historyService.getAll();
      setHistory(res.data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së historikut:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    try {
      const res = await historyService.exportPdf();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "historiku-komunes.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Gabim gjatë shkarkimit të PDF:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  
  const filteredHistory = history.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.entityType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const getEntityBadgeColor = (type) => {
    const t = type?.toLowerCase();
    if (t?.includes("event")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (t?.includes("vendim") || t?.includes("decision")) return "bg-amber-50 text-amber-700 border-amber-200";
    if (t?.includes("projekt")) return "bg-purple-50 text-purple-700 border-purple-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-xl w-1/3"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white p-6 rounded-2xl border border-gray-100 space-y-3">
              <div className="flex justify-between">
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header i Faqes */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Historiku i Aktivitetit</h2>
          <p className="text-xs text-gray-500 mt-0.5">Gjurmimi i të gjitha ngjarjeve, vendimeve dhe ndryshimeve në komunë.</p>
        </div>

        <button
          onClick={downloadPdf}
          disabled={history.length === 0}
          className="inline-flex items-center justify-center gap-2 bg-[#202d60] hover:bg-[#18224a] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={14} />
          Shkarko Raportin (PDF)
        </button>
      </div>

      {/* Kontrollet: Kërkimi */}
      <div className="mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Kërko në historik sipas titullit, përshkrimit ose llojit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-lg outline-none text-xs transition-colors focus:border-[#202d60] focus:bg-white"
          />
        </div>
      </div>

      {/* TIMELINE VIEW CONTAINER */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-3">
            <AlertCircle size={22} />
          </div>
          <h3 className="text-sm font-semibold text-gray-700">Nuk u gjet asnjë rekord</h3>
          <p className="text-xs text-gray-400 mt-1">Provoni të ndryshoni termat e kërkimit ose nuk ka të dhëna në sistem.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-gray-200/80 ml-4 sm:ml-6 space-y-6 pb-6">
          {filteredHistory.map((item) => (
            <div key={item.id} className="relative pl-6 sm:pl-8 group">
              
              {/* Pika treguese në Timeline (ndryshon efektin kur kalon mausi sipër) */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-gray-300 group-hover:border-[#202d60] group-hover:bg-[#202d60] transition-all duration-200 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-white transition-colors" />
              </div>

              {/* Karta e të dhënave */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Badge për Entity Type */}
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getEntityBadgeColor(item.entityType)}`}>
                      {item.entityType || "Aktivitet"}
                    </span>
                    <h3 className="text-sm font-bold text-gray-800 group-hover:text-[#202d60] transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Data e formatuar bukur */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-md">
                    <Clock size={13} />
                    <span>
                      {item.date 
                        ? new Date(item.date).toLocaleDateString("sq-AL", { day: "numeric", month: "short", year: "numeric" }) 
                        : "Pa datë"}
                    </span>
                  </div>
                </div>

                {/* Përshkrimi */}
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Lokacioni (nëse ekziston) */}
                {item.location && (
                  <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                    <MapPin size={13} className="text-gray-400" />
                    <span>{item.location}</span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;