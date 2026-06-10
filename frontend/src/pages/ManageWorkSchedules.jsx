import { useEffect, useState } from "react";
import { workScheduleService } from "../services/workSchedule";
import WorkScheduleForm from "../components/workschedule/WorkScheduleForm";
import { RefreshCw, Plus, Edit2, Trash2, Clock, MapPin, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

export default function ManageWorkSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await workScheduleService.getAll();
      setSchedules(res.data);
    } catch {
      toast.error("Ngarkimi dështoi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni i sigurt që dëshironi të fshini këtë orar?")) return;
    try {
      await workScheduleService.delete(id);
      toast.success("Orari u fshi me sukses.");
      fetchData();
    } catch {
      toast.error("Fshirja dështoi!");
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("sq-AL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Menaxho orarin</h1>
          <p className="text-sm text-slate-500">Shiko dhe menaxho oraret e stafit.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
            title="Rifresko"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-[#010694] hover:bg-[#010694]/90 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
          >
            <Plus size={16} />
            Shto orar
          </button>
        </div>
      </div>

      {showForm && (
        <WorkScheduleForm
          editing={editing}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchData();
          }}
        />
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col justify-center items-center gap-2 py-16 text-slate-500">
            <Loader2 className="animate-spin text-[#010694]" size={32} />
            <p>Po ngarkon...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Stafi
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Orari
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Lokacioni
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Veprimet
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedules.length > 0 ? (
                    schedules.map((s, i) => (
                      <tr key={s.id ?? i} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-[#eff0ff] text-[#010694] text-xs font-medium flex items-center justify-center flex-shrink-0">
                              {getInitials(s.staffName)}
                            </div>
                            <span className="font-medium text-slate-900 text-sm">
                              {s.staffName || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600">{formatDate(s.date)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-500">
                            <Clock size={13} />
                            {s.shiftStart} – {s.shiftEnd}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                            <MapPin size={14} className="text-slate-400" />
                            {s.location || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              onClick={() => handleEdit(s)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Edito"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(s.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Fshij"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                            <Clock size={24} />
                          </div>
                          <p>Nuk u gjet asnjë orar.</p>
                          <button
                            onClick={handleAdd}
                            className="text-[#010694] hover:underline font-medium text-sm"
                          >
                            Shto një tani
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
              <p className="text-xs text-slate-500">
                Duke shfaqur{" "}
                <span className="font-semibold">{schedules.length}</span> orare
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}