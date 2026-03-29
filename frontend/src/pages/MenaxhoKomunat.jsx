import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { komunaService } from "../services/komunaService";
import { toast } from "react-toastify";
import { 
  Search, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  MapPin, 
  Plus
} from "lucide-react";

export default function MenaxhoKomunat() {
  const [komunas, setKomunas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchKomunas = async () => {
    setLoading(true);
    try {
      const res = await komunaService.getAll();
      setKomunas(res.data);
    } catch {
      toast.error("Gabim gjatë marrjes së të dhënave të komunave");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKomunas();
  }, []);

  const filtered = komunas.filter((k) =>
    k.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id, name) => {
    if (!window.confirm(`A jeni i sigurt që dëshironi të fshini "${name}"?`)) return;
    try {
      await komunaService.delete(id);
      toast.success("Komuna u fshi me sukses.");
      fetchKomunas();
    } catch {
      toast.error("Fshirja dështoi!");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Komunat e listuara</h1>
          <p className="text-sm text-slate-500">
            Menaxho dhe monitoro të gjitha komunat.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchKomunas}
            className="p-2.5 text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
            title="Rifresko"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          
          <Link 
            to="/AddKomuna"
            className="flex items-center gap-2 bg-[#010694] hover:bg-[#1a1e8a] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm transform hover:scale-105"
          >
            <Plus size={18} />
            Shto Komunën
          </Link>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#010694] transition-colors" size={18} />
        <input
          type="text"
          placeholder="Kërko sipas emrit të komunës..."
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
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Komuna</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Përshkrimi</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Veprimet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#eff0ff] text-[#010694] flex items-center justify-center rounded-lg shadow-sm">
                          <MapPin size={20} />
                        </div>
                        <span className="font-semibold text-slate-900">{k.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-500 max-w-xs truncate">
                        {k.description || "Nuk ka përshkrim."}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => navigate(`/edit-komuna/${k.id}`)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edito"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(k.id, k.name)}
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
                  <td colSpan="3" className="px-6 py-12 text-center text-slate-400 text-sm">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                        <MapPin size={24} />
                      </div>
                      <p>Nuk u gjet asnjë komunë.</p>
                      <Link 
                        to="/AddKomuna"
                        className="text-[#010694] hover:underline font-medium"
                      >
                        Krijo një tani
                      </Link>
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
            Duke shfaqur <span className="font-semibold">{filtered.length}</span> nga <span className="font-semibold">{komunas.length}</span> komuna
          </p>
        </div>
      </div>
    </div>
  );
}
