import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { staffService } from "../services/staffService";
import { departmentService } from "../services/departmentService";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Briefcase,
  Calendar,
  Loader2,
} from "lucide-react";

export default function EditStaff() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    dateHired: "",
    departmentId: "",
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const [staffRes, deptsRes] = await Promise.all([
          staffService.getById(id),
          departmentService.getAll(),
        ]);

        const staff = staffRes.data;


        setForm({
          firstName: staff.firstName || "",
          lastName: staff.lastName || "",
          email: staff.email || "",
          position: staff.position || "",
          dateHired: staff.dateHired ? staff.dateHired.split("T")[0] : "",
          departmentId: staff.departmentId || "",
        });

        setDepartments(deptsRes.data || []);
      } catch (err) {
        console.error("Error fetching staff:", err);
        toast.error("Gabim gjatë marrjes së të dhënave të stafit");
        navigate("/manage-staff");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (form.firstName.trim().length < 2 || form.lastName.trim().length < 2) {
      toast.error("Emri dhe mbiemri duhet të kenë së paku 2 karaktere");
      return;
    }

    if (!form.departmentId) {
      toast.error("Zgjidhni një departament");
      return;
    }

    setLoading(true);
    try {
   
      await staffService.update(id, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        position: form.position,
        dateHired: form.dateHired,
        departmentId: parseInt(form.departmentId),
      });

      toast.success("Profili i stafit u përditësua me sukses!");
      navigate("/manage-staff");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Përditësimi dështoi. Provoni përsëri.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center flex-col gap-2 items-center h-64 text-slate-500 animate-pulse">
        <Loader2 className="animate-spin text-[#010694]" size={32} />
        <div className="font-medium">Po ngarkohen të dhënat...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Back Button */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#010694] transition-colors w-fit group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Kthehu mbrapa
        </button>
        <h1 className="text-2xl font-semibold text-slate-900">
          Edito Profilin e Stafit
        </h1>
        <p className="text-sm text-slate-500">
          ID e punonjësit:{" "}
          <span className="font-mono font-bold text-[#010694]">{id}</span>
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emri */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User size={16} className="text-[#010694]" /> Emri
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#010694]/20 focus:border-[#010694] outline-none transition-all text-sm"
                required
              />
            </div>

            {/* Mbiemri */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User size={16} className="text-[#010694]" /> Mbiemri
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#010694]/20 focus:border-[#010694] outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Mail size={16} className="text-[#010694]" /> Email Adresa
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#010694]/20 focus:border-[#010694] outline-none transition-all text-sm"
              required
            />
          </div>

          {/* Pozicioni */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Briefcase size={16} className="text-[#010694]" /> Pozicioni i
              Punës
            </label>
            <input
              type="text"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#010694]/20 focus:border-[#010694] outline-none transition-all text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data e punësimit */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Calendar size={16} className="text-[#010694]" /> Data e
                Fillimit
              </label>
              <input
                type="date"
                value={form.dateHired}
                onChange={(e) =>
                  setForm({ ...form, dateHired: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#010694]/20 focus:border-[#010694] outline-none transition-all text-sm"
                required
              />
            </div>

            {/* Departamenti */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User size={16} className="text-[#010694]" /> Departamenti
              </label>
              <select
                value={form.departmentId}
                onChange={(e) =>
                  setForm({ ...form, departmentId: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#010694]/20 focus:border-[#010694] outline-none transition-all text-sm"
                required
              >
                <option value="">Zgjidhni...</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 flex items-center gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all"
            >
              Anulo
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] flex items-center justify-center gap-2 bg-[#010694] hover:bg-[#1a1e8a] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md disabled:opacity-70 transform active:scale-95"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {loading ? "Duke ruajtur..." : "Ruaj Ndryshimet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
