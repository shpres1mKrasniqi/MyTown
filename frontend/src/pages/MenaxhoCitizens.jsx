import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { citizenService } from "../services/citizenService";
import { advancedSearchService } from "../services/advancedSearchService";
import { komunaService } from "../services/komunaService";
import useAdvancedSearch from "../hooks/useAdvancedSearch";
import SearchForm from "../components/SearchForm";
import Pagination from "../components/Pagination";
import { toast } from "react-toastify";
import {
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Users,
  Loader2,
} from "lucide-react";

export default function MenaxhoCitizens() {
  const [komunas, setKomunas] = useState([]);
  const navigate = useNavigate();

  const { data, totalCount, filters, setFilters, loading, refetch } =
    useAdvancedSearch(
    advancedSearchService.searchCitizens,
    {
      pageNumber: 1,
      pageSize: 10,
      firstName: "",
      lastName: "",
      email: "",
      municipalityId: "",
    },
  );

  useEffect(() => {
    const loadKomunas = async () => {
      try {
        const res = await komunaService.getAll();
        setKomunas(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadKomunas();
  }, []);

  const handleRefresh = () => refetch();

  const handleDelete = async (id, name) => {
    if (!window.confirm(`A jeni i sigurt që dëshironi të fshini "${name}"?`))
      return;

    try {
      await citizenService.delete(id);
      toast.success("Qytetari u fshi me sukses.");
      handleRefresh();
    } catch {
      toast.error("Fshirja dështoi!");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Qytetarët e listuar
          </h1>
          <p className="text-sm text-slate-500">
            Menaxho dhe monitoro të gjithë qytetarët e regjistruar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2.5 text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
            title="Rifresko"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>

          <Link
            to="/AddCitizen"
            className="flex items-center gap-2 bg-[#010694] hover:bg-[#1a1e8a] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm transform hover:scale-105"
          >
            <Plus size={18} />
            Shto Qytetar
          </Link>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">
          Kërkim i avancuar
        </h2>
        <SearchForm
          filters={filters}
          setFilters={setFilters}
          fields={[
            { name: "firstName", placeholder: "Kërko sipas emrit..." },
            { name: "lastName", placeholder: "Kërko sipas mbiemrit..." },
            { name: "email", placeholder: "Kërko sipas email-it..." },
            {
              name: "municipalityId",
              type: "select",
              placeholder: "Të gjitha komunat",
              options: komunas.map((k) => ({
                value: k.id,
                label: k.name,
              })),
            },
          ]}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center flex-col gap-2 items-center py-16 text-slate-500">
            <Loader2 className="animate-spin text-[#010694]" size={32} />
            <div>Po ngarkon...</div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Qytetari
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Telefoni
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Adresa
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Komuna
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Veprimet
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.length > 0 ? (
                    data.map((citizen) => (
                      <tr
                        key={citizen.id}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-[#eff0ff] text-[#010694] flex items-center justify-center rounded-lg shadow-sm">
                              <Users size={20} />
                            </div>
                            <span className="font-semibold text-slate-900">
                              {citizen.firstName} {citizen.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-500">
                            {citizen.email || "—"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-500">
                            {citizen.phoneNumber || "—"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-500 max-w-xs truncate">
                            {citizen.address || "Nuk ka adresë."}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-500">
                            {citizen.komunaName || "—"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              onClick={() =>
                                navigate(`/edit-citizen/${citizen.id}`)
                              }
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Edito"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(
                                  citizen.id,
                                  `${citizen.firstName} ${citizen.lastName}`,
                                )
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
                        colSpan="6"
                        className="px-6 py-12 text-center text-slate-400 text-sm"
                      >
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                            <Users size={24} />
                          </div>
                          <p>Nuk u gjet asnjë qytetar.</p>
                          <Link
                            to="/AddCitizen"
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

            <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-xs text-slate-500">
                Duke shfaqur{" "}
                <span className="font-semibold">{data.length}</span> nga{" "}
                <span className="font-semibold">{totalCount}</span> qytetarë
              </p>
              <Pagination
                filters={filters}
                setFilters={setFilters}
                totalCount={totalCount}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
