import { useEffect, useState } from "react";
import { meetingService } from "../services/meetingService";
import { toast } from "react-toastify";
import { Search, Trash2, RefreshCw, MessageSquare, Calendar } from "lucide-react";
import DataExchangeToolbar from "../components/DataExchangeToolbar";

export default function MenaxhoMeetings({ isReadonly = false }) {
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = await meetingService.getAll();
      setMeetings(res.data);
    } catch (err) {
      console.error("Fetch meetings error:", err);
      toast.error(
        err.response?.data?.message || 
        err.response?.data || 
        "Gabim gjatë marrjes së kërkesave"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const filtered = meetings.filter((m) =>
    (m.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.reason || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funksioni për përditësimin e statusit kur ndryshohet dropdown-i
  const handleStatusChange = async (id, newStatus) => {
    try {
      await meetingService.updateStatus(id, {
        status: Number(newStatus),
      });
      toast.success("Statusi u përditësua me sukses!");
      fetchMeetings(); // Rifreskon të dhënat live në tabelë
    } catch (err) {
      toast.error("Gabim gjatë përditësimit të statusit");
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`A jeni i sigurt që dëshironi të fshini kërkesën "${title}"?`)) return;
    try {
      await meetingService.deleteSoft(id);
      toast.success("Kërkesa u fshi me sukses.");
      fetchMeetings();
    } catch {
      toast.error("Fshirja dështoi!");
    }
  };

  // Stilet premium për dropdown-in sipas statusit aktual
  const getStatusStyles = (status) => {
    switch (Number(status)) {
      case 0:
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70";
      case 1:
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70";
      case 2:
        return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 animate-fadeIn">
      {/* HEADER SEKSIONI */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 bg-gradient-to-r from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#202d60]" />
        
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Kërkesat për Takim</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Menaxho të gjitha kërkesat e qytetarëve për takime.
          </p>
        </div>
        
        <div className="flex items-center gap-3 self-start sm:self-center bg-white p-1.5 rounded-xl border border-slate-200/60 shadow-inner">
          {!isReadonly && <DataExchangeToolbar entityType="meetings" onImportSuccess={fetchMeetings} />}
          <button 
            onClick={fetchMeetings}
            className="p-2 text-slate-500 hover:text-[#202d60] hover:bg-slate-100 rounded-lg transition-all duration-150"
            title="Rifresko"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* INPUTI I KËRKIMIT PREMIUM */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#202d60] transition-colors" size={16} />
        <input
          type="text"
          placeholder="Kërko sipas titullit ose arsyes së takimit..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#202d60]/10 focus:border-[#202d60] transition-all text-sm shadow-sm font-medium text-slate-700 placeholder-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABELA PREMIUM */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#202d60] text-white text-xs font-bold uppercase tracking-wider border-b border-[#162045]">
                <th className="px-6 py-4.5 font-bold tracking-wide">Titulli</th>
                <th className="px-6 py-4.5 font-bold tracking-wide">Arsyeja</th>
                <th className="px-6 py-4.5 font-bold tracking-wide">Data e Kërkuar</th>
                <th className="px-6 py-4.5 font-bold tracking-wide">Statusi</th>
                {!isReadonly && <th className="px-6 py-4.5 font-bold tracking-wide text-right">Veprimet</th>}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.length > 0 ? (
                filtered.map((m, index) => {
                  return (
                    <tr key={m.id || index} className="hover:bg-blue-50/40 even:bg-slate-50/30 transition-colors duration-150 group">
                      <td className="px-6 py-4.5 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 bg-blue-50 text-[#202d60] flex items-center justify-center rounded-xl border border-blue-100 shadow-sm flex-shrink-0">
                            <MessageSquare size={16} />
                          </div>
                          <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-150 block truncate max-w-[200px]">
                            {m.title}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4.5 text-slate-600 font-medium max-w-xs truncate align-middle">
                        {m.reason}
                      </td>
                      
                      <td className="px-6 py-4.5 align-middle">
                        <span className="flex items-center gap-2 text-slate-600 font-semibold text-xs bg-slate-100 px-2.5 py-1 rounded-lg w-fit border border-slate-200/60 whitespace-nowrap">
                          <Calendar size={13} className="text-blue-600" />
                          {new Date(m.dateOfMeeting).toLocaleDateString("sq-AL", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </td>
                      
                      {/* STATUSI SI DROPDOWN (ZGJEDHJE DIREKTE) */}
                      <td className="px-6 py-4.5 align-middle">
                        <select
                          value={m.status}
                          onChange={(e) => handleStatusChange(m.id, e.target.value)}
                          className={`text-xs font-bold border rounded-xl px-3 py-1.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer shadow-sm transition-all duration-150 bg-white ${getStatusStyles(m.status)}`}
                        >
                          <option value={0}>Në pritje</option>
                          <option value={1}>Pranuar</option>
                          <option value={2}>Refuzuar</option>
                        </select>
                      </td>
                      
                      {!isReadonly && (
                        <td className="px-6 py-4.5 text-right align-middle whitespace-nowrap">
                          <div className="flex justify-end items-center gap-2">
                            {/* BUTONI FSHIJ */}
                            <button 
                              onClick={() => handleDelete(m.id, m.title)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 transition-all duration-150 shadow-sm hover:shadow"
                              title="Fshij kërkesën"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isReadonly ? 4 : 5} className="px-6 py-16 text-center text-slate-400 bg-white">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-12 w-12 bg-blue-50 text-[#202d60] rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                        <MessageSquare size={22} />
                      </div>
                      <p className="font-semibold text-slate-700 text-base">Nuk u gjet asnjë kërkesë.</p>
                      <p className="text-xs text-slate-400 -mt-1">Nuk ka të dhëna për t'u shfaqur për këtë kriter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER STATISTIKAT */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
          <p className="text-xs text-slate-500 font-medium">
            Duke shfaqur <span className="font-bold text-slate-700 bg-slate-200/60 px-1.5 py-0.5 rounded">{filtered.length}</span> nga <span className="font-bold text-slate-700 bg-slate-200/60 px-1.5 py-0.5 rounded">{meetings.length}</span> kërkesa gjithsej
          </p>
        </div>
      </div>
    </div>
  );
}