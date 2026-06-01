import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IssueService } from "../services/IssueServices";
import { toast } from "react-toastify";
import { 
  Search, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  AlertTriangle, 
  Plus
} from "lucide-react";
import DataExchangeToolbar from "../components/DataExchangeToolbar";

export default function MenaxhoIssues() {
  const [issues, setIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await IssueService.getAll();
      setIssues(res.data);
    } catch {
      toast.error("Gabim gjatë marrjes së të dhënave të ankesave");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const filtered = issues.filter((i) =>
    (i.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.komunaName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id, title) => {
    if (!window.confirm(`A jeni i sigurt që dëshironi të fshini "${title}"?`)) return;
    try {
      await IssueService.delete(id);
      toast.success("Ankesa u fshi me sukses.");
      fetchIssues();
    } catch {
      toast.error("Fshirja dështoi!");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Ankesat (Issues)</h1>
          <p className="text-sm text-slate-500">
            Menaxho dhe monitoro të gjitha ankesat në formë tabele.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <DataExchangeToolbar entityType="issues" onImportSuccess={fetchIssues} />
          
          <button 
            onClick={fetchIssues}
            className="p-2.5 text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
            title="Rifresko"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#010694] transition-colors" size={18} />
        <input
          type="text"
          placeholder="Kërko sipas titullit ose komunës..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/20 focus:border-[#010694] transition-all text-sm shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Titulli</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Komuna / Kategoria</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Statusi</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Veprimet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-red-50 text-red-600 flex items-center justify-center rounded-lg shadow-sm">
                          <AlertTriangle size={20} />
                        </div>
                        <span className="font-semibold text-slate-900">{i.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-900 font-medium">{i.komunaName}</p>
                      <p className="text-xs text-slate-500">{i.categoryName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {i.status || "Aktive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2 opacity-100 sm:opacity-100 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDelete(i.id, i.title)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Fshij"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400 text-sm">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                        <AlertTriangle size={24} />
                      </div>
                      <p>Nuk u gjet asnjë ankesë.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER */}
        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
          <p className="text-xs text-slate-500">
            Duke shfaqur <span className="font-semibold">{filtered.length}</span> nga <span className="font-semibold">{issues.length}</span> ankesa
          </p>
        </div>
      </div>
    </div>
  );
}
