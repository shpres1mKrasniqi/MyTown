import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { staffService } from "../services/staffService";
import { departmentService } from "../services/departmentService";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Key,
  Building2,
  Calendar,
  Briefcase,
  Loader2,
} from "lucide-react";

export default function AddStaff() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    position: "",
    dateHired: "",
    departmentId: "",
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await departmentService.getAll();
        setDepartments(res.data);
      } catch (err) {
        toast.error("Gabim gjatë marrjes së departamenteve");
      }
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

 if (!form.firstName || form.firstName.length < 3 || form.firstName.length > 50) {
  toast.error("Emri duhet të ketë 3 deri në 50 karaktere.");
  return;
}

if (!form.lastName || form.lastName.length < 3 || form.lastName.length > 50) {
  toast.error("Mbiemri duhet të ketë 3 deri në 50 karaktere.");
  return;
}


const emailRegex = /\S+@\S+\.\S+/;
if (!form.email || !emailRegex.test(form.email)) {
  toast.error("Ju lutem jepni një email valid.");
  return;
}

if (!form.password || form.password.length < 6 || form.password.length > 50) {
  toast.error("Fjalëkalimi duhet të ketë 6 deri në 50 karaktere.");
  return;
}


if (!form.position || form.position.length < 10 || form.position.length > 100) {
  toast.error("Pozita duhet të ketë 10 deri në 100 karaktere.");
  return;
}

    if (!form.departmentId) {
      toast.error("Ju lutem zgjidhni një departament");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        departmentId: parseInt(form.departmentId, 10),
      };
      await staffService.create(payload);
      toast.success("Stafi u shtua me sukses!");
      navigate("/manage-staff");
    } catch (err) {
      toast.error(err.response?.data?.message || "Shtimi i stafit dështoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#010694] transition-colors w-fit"
        >
          <ArrowLeft size={18} />
          Kthehu mbrapa
        </button>
        <h1 className="text-2xl font-semibold text-slate-900">
          Shto Staf të ri
        </h1>
        <p className="text-sm text-slate-500">
          Plotësoni të dhënat e mëposhtme për të regjistruar një anëtar të ri të
          stafit.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Emri */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User size={16} className="text-[#010694]" /> Emri
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/5 focus:border-[#010694] transition-all text-sm"
                placeholder="Psh. Filan"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
            </div>

            {/* Mbiemri */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User size={16} className="text-[#010694]" /> Mbiemri
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/5 focus:border-[#010694] transition-all text-sm"
                placeholder="Psh. Fisteku"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
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
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/5 focus:border-[#010694] transition-all text-sm"
              placeholder="emri.mbiemri@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Key size={16} className="text-[#010694]" /> Fjalëkalimi
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/5 focus:border-[#010694] transition-all text-sm"
              placeholder="Së paku 6 karaktere"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pozicioni */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Briefcase size={16} className="text-[#010694]" /> Pozicioni
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/5 focus:border-[#010694] transition-all text-sm"
                placeholder="Psh. Zyrtar Ligjor"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              />
            </div>

            {/* Data e punësimit */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Calendar size={16} className="text-[#010694]" /> Data e
                Punësimit
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/5 focus:border-[#010694] transition-all text-sm"
                value={form.dateHired}
                onChange={(e) =>
                  setForm({ ...form, dateHired: e.target.value })
                }
              />
            </div>
          </div>

          {/* Dropdown për Departament */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Building2 size={16} className="text-[#010694]" /> Cakto në
              Departament
            </label>
            <select
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/5 focus:border-[#010694] transition-all text-sm"
              value={form.departmentId}
              onChange={(e) =>
                setForm({ ...form, departmentId: e.target.value })
              }
            >
              <option value="" disabled>
                Selektoni një departament
              </option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="pt-6 flex items-center gap-3">
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
              className="flex-[2] flex items-center justify-center gap-2 bg-[#010694] hover:bg-[#1a1e8a] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Duke u ruajtur...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Ruaj Stafin
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer info */}
      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
        <p className="text-xs text-blue-600 leading-relaxed">
          <b>Kujdes:</b> Pas krijimit të llogarisë, anëtari i stafit do të mund
          të kyçet në sistem me emailin dhe fjalëkalimin e specifikuar më sipër.
        </p>
      </div>
    </div>
  );
}
