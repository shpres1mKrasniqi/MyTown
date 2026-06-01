import { useEffect, useState } from "react";
import { meetingService } from "../services/meetingService";
import { toast } from "react-toastify";
import { Search, Trash2, RefreshCw, MessageSquare } from "lucide-react";
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

  const getStatusInfo = (status) => {
    switch (status) {
      case 0: return { text: "Në pritje", classes: "bg-amber-50 text-amber-700 border-amber-100" };
      case 1: return { text: "Pranuar", classes: "bg-emerald-50 text-emerald-700 border-emerald-100" };
      case 2: return { text: "Refuzuar", classes: "bg-rose-50 text-rose-700 border-rose-100" };
      default: return { text: "I panjohur", classes: "bg-slate-50 text-slate-700 border-slate-100" };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Kërkesat për Takim</h1>
          <p className="text-sm text-slate-500">
            Menaxho të gjitha kërkesat e qytetarëve për takime.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {!isReadonly && <DataExchangeToolbar entityType="meetings" onImportSuccess={fetchMeetings} />}
          <button 
            onClick={fetchMeetings}
            className="p-2.5 text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
            title="Rifresko"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#010694] transition-colors" size={18} />
        <input
          type="text"
          placeholder="Kërko sipas titullit ose arsyes..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/20 focus:border-[#010694] transition-all text-sm shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Titulli</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Arsyeja</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Data e Kërkuar</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Statusi</th>
                {!isReadonly && <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Veprimet</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((m) => {
                  const statusInfo = getStatusInfo(m.status);
                  return (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-lg shadow-sm">
                          <MessageSquare size={20} />
                        </div>
                        <span className="font-semibold text-slate-900">{m.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 max-w-xs truncate">
                      {m.reason}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {new Date(m.dateOfMeeting).toLocaleDateString("sq-AL")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${statusInfo.classes}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    {!isReadonly && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2 opacity-100 sm:opacity-100 sm:group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleDelete(m.id, m.title)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Fshij"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )})
              ) : (
                <tr>
                  <td colSpan={isReadonly ? 4 : 5} className="px-6 py-12 text-center text-slate-400 text-sm">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                        <MessageSquare size={24} />
                      </div>
                      <p>Nuk u gjet asnjë kërkesë.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
          <p className="text-xs text-slate-500">
            Duke shfaqur <span className="font-semibold">{filtered.length}</span> nga <span className="font-semibold">{meetings.length}</span> kërkesa
          </p>
        </div>
      </div>
    </div>
  );
}
