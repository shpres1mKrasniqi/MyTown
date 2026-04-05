import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { staffService } from "../services/staffService";
import { toast } from "react-toastify";
import { Search, Edit2, Trash2, RefreshCw, User, Plus } from "lucide-react";

export default function MenaxhoStaff() {
  const [staffs, setStaffs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchStaffs = async () => {
    setLoading(true);
    try {
     
      const res = await staffService.getAll();
      setStaffs(res.data);
      
    } catch {
      toast.error("Gabim gjatë marrjes së stafit");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchStaffs();
}, []);


  const filtered = staffs.filter((s) =>
    `${s.firstName} ${s.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(`A jeni i sigurt që dëshironi të fshini staf "${name}"?`)
    )
      return;
    try {
      await staffService.delete(id);
      toast.success("Stafi u fshi me sukses.");
      fetchStaffs();
    } catch {
      toast.error("Fshirja dështoi!");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Stafi</h1>
          <p className="text-sm text-slate-500">
            Menaxho dhe monitoro të gjithë stafin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStaffs}
            className="p-2.5 text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>

          <Link
            to="/add-staff"
            className="flex items-center gap-2 bg-[#010694] hover:bg-[#1a1e8a] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            <Plus size={18} />
            Shto Staf
          </Link>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative group">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#010694] transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Kërko sipas emrit të stafit..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/5 focus:border-[#010694] transition-all text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Emri dhe Mbiemri
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Pozicioni
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Departamenti
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                  Veprimet
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-10 w-10 bg-[#eff0ff] text-[#010694] flex items-center justify-center rounded-lg">
                        <User size={20} />
                      </div>
                      <span className="font-semibold text-slate-900">
                        {s.firstName} {s.lastName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {s.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {s.position}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {s.departmentName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => navigate(`/edit-staff/${s.id}`)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edito"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(s.id, `${s.firstName} ${s.lastName}`)
                          }
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
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-slate-400 text-sm"
                  >
                    Nuk u gjet asnjë staf.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
          <p className="text-xs text-slate-500">
            Duke shfaqur{" "}
            <span className="font-semibold">{filtered.length}</span> nga{" "}
            <span className="font-semibold">{staffs.length}</span> staf
          </p>
        </div>
      </div>
    </div>
  );
}
