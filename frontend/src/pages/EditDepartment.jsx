import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { departmentService } from "../services/departmentService";
import { komunaService } from "../services/komunaService";
import { toast } from "react-toastify";
import { Save, Building2, AlignLeft, Loader2, X, MapPin } from "lucide-react";

export default function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialForm = {
    name: "",
    description: "",
    komunaId: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [komunas, setKomunas] = useState([]);

  const showToast = (type, message) => {
    toast.dismiss();

    toast[type](message, {
      toastId: "main-toast",
      onClick: () => toast.dismiss("main-toast"),
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depRes, komRes] = await Promise.all([
          departmentService.getById(id),
          komunaService.getAll(),
        ]);

        setForm({
          name: depRes.data.name || "",
          description: depRes.data.description || "",
          komunaId: depRes.data.komunaId || "",
        });

        setKomunas(komRes.data || []);
      } catch (err) {
        console.error("Gabim gjatë marrjes së të dhënave:", err);
        showToast("error", "Gabim gjatë marrjes së të dhënave!");
        navigate("/menaxhoDepartments");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const normalizeFieldName = (key) => {
    const lowerKey = key.toLowerCase();

    if (lowerKey.includes("name")) return "name";
    if (lowerKey.includes("description")) return "description";
    if (lowerKey.includes("komunaid")) return "komunaId";

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
      name: form.name,
      description: form.description,
      komunaId: Number(form.komunaId),
    };

    try {
      await departmentService.update(id, payload);

      showToast("success", "Departamenti u përditësua me sukses!");
      navigate("/menaxhoDepartments");
    } catch (err) {
      console.error("Gabim gjatë përditësimit:", err.response?.data || err);

      const backendData = err.response?.data;

      if (backendData?.errors) {
        setErrors(formatBackendErrors(backendData.errors));
        return;
      }

      const backendMessage =
        backendData?.message || backendData?.title || "Përditësimi dështoi!";

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

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#010694]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          Edito Departamentin
        </h1>

        <p className="text-sm text-slate-500">
          Modifiko detajet e drejtorisë
          <span className="font-bold text-slate-700">"{form.name}"</span>.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6" noValidate>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Building2 size={16} className="text-[#010694]" />
              Emri i Departamentit
            </label>

            <input
              type="text"
              name="name"
              className={getInputClasses("name")}
              value={form.name}
              onChange={handleChange}
            />

            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <AlignLeft size={16} className="text-[#010694]" />
              Përshkrimi
            </label>

            <textarea
              rows="5"
              name="description"
              className={`${getInputClasses("description")} resize-none`}
              value={form.description}
              onChange={handleChange}
            />

            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MapPin size={16} className="text-[#010694]" />
              Zgjedh Komunën
            </label>

            <select
              name="komunaId"
              className={getInputClasses("komunaId")}
              value={form.komunaId}
              onChange={handleChange}
            >
              <option value="">Selektoni një komunë</option>
              {komunas.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>

            {errors.komunaId && (
              <p className="text-sm text-red-500">{errors.komunaId}</p>
            )}
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/menaxhoDepartments")}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all disabled:opacity-70"
            >
              <X size={18} />
              Anulo
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-[2] flex items-center justify-center gap-2 bg-[#010694] hover:bg-[#1a1e8a] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm disabled:opacity-70"
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

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl border-dashed">
        <p className="text-[11px] text-slate-400 text-center uppercase tracking-widest font-bold">
          ID e Departamentit: {id}
        </p>
      </div>
    </div>
  );
}
