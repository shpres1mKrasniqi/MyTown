import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { departmentService } from "../services/departmentService";
import { komunaService } from "../services/komunaService";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Save,
  Building2,
  AlignLeft,
  Loader2,
  MapPin,
} from "lucide-react";

export default function AddDepartment() {
  const initialForm = {
    name: "",
    description: "",
    komunaId: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [komunas, setKomunas] = useState([]);
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
    const fetchKomunas = async () => {
      try {
        const res = await komunaService.getAll();
        setKomunas(res.data);
      } catch (err) {
        console.error("Gabim gjatë marrjes së komunave:", err);
      }
    };

    fetchKomunas();
  }, []);

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
      await departmentService.create(payload);

      showToast("success", "Departamenti u krijua me sukses.");
      setForm(initialForm);
      navigate("/menaxhoDepartments");
    } catch (err) {
      console.error(
        "Gabim gjatë krijimit të departamentit:",
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
        "Shtimi i departamentit dështoi.";

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
          Shto Drejtori të re
        </h1>

        <p className="text-sm text-slate-500">
          Plotësoni të dhënat më poshtë për të krijuar një departament të ri në
          sistem.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6" noValidate>
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

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Building2 size={16} className="text-[#010694]" />
              Emri i Drejtorisë
            </label>

            <input
              type="text"
              name="name"
              className={getInputClasses("name")}
              placeholder="Psh. Drejtoria e Urbanizmit"
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
              Përshkrimi i shkurtër
            </label>

            <textarea
              rows="4"
              name="description"
              className={`${getInputClasses("description")} resize-none`}
              placeholder="Shpjegoni fushëveprimtarinë e kësaj drejtorie..."
              value={form.description}
              onChange={handleChange}
            />

            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="pt-4 flex items-center gap-3">
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
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {loading ? "Duke u ruajtur..." : "Ruaj Departamentin"}
            </button>
          </div>
        </form>
      </div>

      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
        <p className="text-xs text-blue-600 leading-relaxed">
          <b>Shënim:</b> Pas ruajtjes, departamenti do të jetë i dukshëm për
          qytetarët dhe stafi do të ketë mundësi të caktohet në këtë drejtori.
        </p>
      </div>
    </div>
  );
}
