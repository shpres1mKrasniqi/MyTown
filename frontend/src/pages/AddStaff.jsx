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
  const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    position: "",
    dateHired: "",
    departmentId: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const showToast = (type, message) => {
    toast.dismiss();

    toast[type](message, {
      toastId: "main-toast",
      onClick: () => toast.dismiss("main-toast"),
    });
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await departmentService.getAll();
        setDepartments(res.data);
      } catch (err) {
        console.error("Gabim gjatë marrjes së departamenteve:", err);
      }
    };

    fetchDepartments();
  }, []);

  const normalizeFieldName = (key) => {
    const lowerKey = key.toLowerCase();

    if (lowerKey.includes("firstname")) return "firstName";
    if (lowerKey.includes("lastname")) return "lastName";
    if (lowerKey.includes("email")) return "email";
    if (lowerKey.includes("password")) return "password";
    if (lowerKey.includes("position")) return "position";
    if (lowerKey.includes("datehired")) return "dateHired";
    if (lowerKey.includes("departmentid")) return "departmentId";

    return key.charAt(0).toLowerCase() + key.slice(1);
  };

  const formatBackendErrors = (responseErrors) => {
    const formattedErrors = {};

    Object.keys(responseErrors).forEach((key) => {
      const fieldName = normalizeFieldName(key);
      const messages = responseErrors[key];

      formattedErrors[fieldName] = Array.isArray(messages)
        ? messages[0]
        : messages;
    });

    return formattedErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setErrors({});
    setLoading(true);

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      position: form.position,
      departmentId: Number(form.departmentId),
      dateHired: form.dateHired
        ? `${form.dateHired}T00:00:00.000Z`
        : "0001-01-01T00:00:00.000Z",
    };

    try {
      await staffService.create(payload);

      showToast("success", "Stafi u shtua me sukses!");
      setForm(initialForm);
      navigate("/manage-staff");
    } catch (err) {
      console.error(
        "Gabim gjatë shtimit të stafit:",
        err.response?.data || err,
      );

      const backendData = err.response?.data;

      if (backendData?.errors) {
        setErrors(formatBackendErrors(backendData.errors));
        return;
      }

      const backendMessage =
        backendData?.message ||
        backendData?.title ||
        "Shtimi i stafit dështoi.";

      showToast("error", backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const getInputClasses = (fieldName) =>
    `w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm ${
      errors[fieldName]
        ? "border-red-400 focus:ring-red-200 focus:border-red-500"
        : "border-slate-200 focus:ring-[#010694]/5 focus:border-[#010694]"
    }`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
        <form onSubmit={handleSubmit} className="p-8 space-y-5" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User size={16} className="text-[#010694]" /> Emri
              </label>

              <input
                type="text"
                name="firstName"
                className={getInputClasses("firstName")}
                placeholder="Psh. Filan"
                value={form.firstName}
                onChange={handleChange}
              />

              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User size={16} className="text-[#010694]" /> Mbiemri
              </label>

              <input
                type="text"
                name="lastName"
                className={getInputClasses("lastName")}
                placeholder="Psh. Fisteku"
                value={form.lastName}
                onChange={handleChange}
              />

              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Mail size={16} className="text-[#010694]" /> Email Adresa
            </label>

            <input
              type="email"
              name="email"
              className={getInputClasses("email")}
              placeholder="emri.mbiemri@email.com"
              value={form.email}
              onChange={handleChange}
            />

            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Key size={16} className="text-[#010694]" /> Fjalëkalimi
            </label>

            <input
              type="password"
              name="password"
              className={getInputClasses("password")}
              placeholder="Së paku 6 karaktere"
              value={form.password}
              onChange={handleChange}
            />

            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Briefcase size={16} className="text-[#010694]" /> Pozicioni
              </label>

              <input
                type="text"
                name="position"
                className={getInputClasses("position")}
                placeholder="Psh. Zyrtar Ligjor"
                value={form.position}
                onChange={handleChange}
              />

              {errors.position && (
                <p className="text-sm text-red-500">{errors.position}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Calendar size={16} className="text-[#010694]" /> Data e
                Punësimit
              </label>

              <input
                type="date"
                name="dateHired"
                className={getInputClasses("dateHired")}
                value={form.dateHired}
                onChange={handleChange}
              />

              {errors.dateHired && (
                <p className="text-sm text-red-500">{errors.dateHired}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Building2 size={16} className="text-[#010694]" /> Cakto në
              Departament
            </label>

            <select
              name="departmentId"
              className={getInputClasses("departmentId")}
              value={form.departmentId}
              onChange={handleChange}
            >
              <option value="">Selektoni një departament</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {errors.departmentId && (
              <p className="text-sm text-red-500">{errors.departmentId}</p>
            )}
          </div>

          <div className="pt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all disabled:opacity-70"
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

      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
        <p className="text-xs text-blue-600 leading-relaxed">
          <b>Kujdes:</b> Pas krijimit të llogarisë, anëtari i stafit do të mund
          të kyçet në sistem me emailin dhe fjalëkalimin e specifikuar më sipër.
        </p>
      </div>
    </div>
  );
}
