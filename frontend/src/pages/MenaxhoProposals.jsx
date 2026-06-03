import { useEffect, useState } from "react";
import { ProposalService } from "../services/proposalService";
import { toast } from "react-toastify";
import { Search, Trash2, RefreshCw, Lightbulb } from "lucide-react";
import DataExchangeToolbar from "../components/DataExchangeToolbar";

export default function MenaxhoProposals({ isReadonly = false }) {
  const [proposals, setProposals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await ProposalService.getAll();
      setProposals(res.data);
    } catch {
      toast.error("Gabim gjatë marrjes së të dhënave të propozimeve");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const filtered = proposals.filter((p) =>
    (p.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id, title) => {
    if (!window.confirm(`A jeni i sigurt që dëshironi të fshini "${title}"?`)) return;
    try {
      await ProposalService.delete(id);
      toast.success("Propozimi u fshi me sukses.");
      fetchProposals();
    } catch {
      toast.error("Fshirja dështoi!");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Projekt Propozimet</h1>
          <p className="text-sm text-slate-500">
            Menaxho dhe monitoro të gjitha projekt propozimet.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {!isReadonly && <DataExchangeToolbar entityType="proposals" onImportSuccess={fetchProposals} />}
          <button 
            onClick={fetchProposals}
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
          placeholder="Kërko sipas titullit..."
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
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Buxheti</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Afati</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Statusi</th>
                {!isReadonly && <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Veprimet</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-yellow-50 text-yellow-600 flex items-center justify-center rounded-lg shadow-sm">
                          <Lightbulb size={20} />
                        </div>
                        <span className="font-semibold text-slate-900">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      € {p.budget}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {new Date(p.votingDeadline).toLocaleDateString("sq-AL")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100">
                        {p.status || "Aktiv"}
                      </span>
                    </td>
                    {!isReadonly && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2 opacity-100 sm:opacity-100 sm:group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleDelete(p.id, p.title)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Fshij"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                        <Lightbulb size={24} />
                      </div>
                      <p>Nuk u gjet asnjë propozim.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
          <p className="text-xs text-slate-500">
            Duke shfaqur <span className="font-semibold">{filtered.length}</span> nga <span className="font-semibold">{proposals.length}</span> propozime
          </p>
        </div>
      </div>
    </div>
  );
}
