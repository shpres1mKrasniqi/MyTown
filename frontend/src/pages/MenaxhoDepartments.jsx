import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { departmentService } from "../services/departmentService";
import { komunaService } from "../services/komunaService"; // ✅ FIX
import { toast } from "react-toastify";
import { Edit2, Trash2, RefreshCw, Building2, Plus } from "lucide-react";
import SearchWithFilter from "../components/SearchWithFilter"; // ✅ IMPORTANT

export default function MenaxhoDepartments() {
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [municipalities, setMunicipalities] = useState([]);

  const navigate = useNavigate();

  // ✅ Fetch municipalities
  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const res = await komunaService.getAll();
        setMunicipalities(res.data);
      } catch {
        toast.error("Gabim gjatë marrjes së komunave");
      }
    };

    fetchMunicipalities();
  }, []);

  // ✅ Fetch departments (default load)
  const fetchDepts = async () => {
    setLoading(true);
    try {
      const res = await departmentService.getAll();
      setDepts(res.data);
    } catch {
      toast.error("Gabim gjatë marrjes së të dhënave");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  // ✅ Delete
  const handleDelete = async (id, name) => {
    if (!window.confirm(`A jeni i sigurt që dëshironi të fshini "${name}"?`))
      return;

    try {
      await departmentService.delete(id);
      toast.success("Departamenti u fshi me sukses.");
      fetchDepts();
    } catch {
      toast.error("Fshirja dështoi!");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Drejtoritë</h1>
          <p className="text-sm text-slate-500">
            Menaxho dhe monitoro të gjitha departamentet e komunës.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDepts}
            className="p-2.5 text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>

          <Link
            to="/AddDepartment"
            className="flex items-center gap-2 bg-[#010694] hover:bg-[#1a1e8a] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            <Plus size={18} />
            Shto Drejtori
          </Link>
        </div>
      </div>

      {/* ✅ SEARCH (FIXED - no wrapper, no icon conflict) */}
      <SearchWithFilter
        municipalities={municipalities}
        placeholder="Kërko drejtoritë..."
        onSearch={async ({ searchTerm, municipalityId }) => {
          setLoading(true);
          try {
            const res = await departmentService.search({
              searchTerm: searchTerm?.trim() || "",
              municipalityId,
              pageNumber: 1,
              pageSize: 10,
            });

            setDepts(res.data.items);
          } catch {
            toast.error("Gabim gjatë kërkimit");
          } finally {
            setLoading(false);
          }
        }}
      />

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Departamenti
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Përshkrimi
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Statusi
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                  Veprimet
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {depts.length > 0 ? (
                depts.map((d) => (
                  <tr
                    key={d.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#eff0ff] text-[#010694] flex items-center justify-center rounded-lg">
                          <Building2 size={20} />
                        </div>
                        <span className="font-semibold text-slate-900">
                          {d.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-500 max-w-xs truncate">
                        {d.description || "Nuk ka përshkrim."}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        Aktiv
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => navigate(`/edit-department/${d.id}`)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(d.id, d.name)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-slate-400 text-sm"
                  >
                    Nuk u gjet asnjë drejtori.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
          <p className="text-xs text-slate-500">
            <span className="font-semibold">{depts.length}</span> drejtori
          </p>
        </div>
      </div>
    </div>
  );
}
