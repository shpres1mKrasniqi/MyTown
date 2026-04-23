import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { issueCategoryService } from "../services/issueCategoryService";
import { toast } from "react-toastify";
import { ArrowLeft, Save, Tag, AlignLeft, Loader2 } from "lucide-react";

export default function AddIssueCategory() {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    const trimmedValue = value.trim();

    switch (name) {
      case "title":
        if (!trimmedValue) return "Titulli është i detyrueshëm";
        if (trimmedValue.length < 3)
          return "Titulli duhet të ketë së paku 3 karaktere";
        if (trimmedValue.length > 100)
          return "Titulli nuk mund të ketë më shumë se 100 karaktere";
        return "";

      case "description":
        if (trimmedValue.length > 500)
          return "Përshkrimi nuk mund të ketë më shumë se 500 karaktere";
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: validateField("title", form.title),
      description: validateField("description", form.description),
    };

    setErrors(newErrors);

    return !newErrors.title && !newErrors.description;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const isValid = validateForm();
    if (!isValid) {
      toast.error("Ju lutem plotësoni formën saktë");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
    };

    setLoading(true);

    try {
      await issueCategoryService.create(payload);
      toast.success("Kategoria e problemit u krijua me sukses");

      setForm({
        title: "",
        description: "",
      });

      setErrors({
        title: "",
        description: "",
      });

      navigate("/admin-dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Shtimi i kategorisë dështoi";

      toast.error(
        typeof message === "string" ? message : "Shtimi i kategorisë dështoi",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
          Shto Kategori të re
        </h1>

        <p className="text-sm text-slate-500">
          Plotësoni të dhënat më poshtë për të krijuar një kategori të re në
          sistem.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6" noValidate>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Tag size={16} className="text-[#010694]" />
              Titulli i Kategorisë së problemit
            </label>

            <input
              type="text"
              name="title"
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm ${
                errors.title
                  ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                  : "border-slate-200 focus:ring-[#010694]/20 focus:border-[#010694]"
              }`}
              placeholder="Psh. Infrastrukturë"
              value={form.title}
              onChange={handleChange}
              onBlur={handleChange}
              maxLength={100}
            />

            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
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
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm resize-none ${
                errors.description
                  ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                  : "border-slate-200 focus:ring-[#010694]/20 focus:border-[#010694]"
              }`}
              placeholder="Shpjegoni detaje shtesë rreth kësaj kategorie..."
              value={form.description}
              onChange={handleChange}
              onBlur={handleChange}
              maxLength={500}
            />

            <div className="flex items-center justify-between">
              {errors.description ? (
                <p className="text-sm text-red-500">{errors.description}</p>
              ) : (
                <span />
              )}

              <p className="text-xs text-slate-400">
                {form.description.length}/500
              </p>
            </div>
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
              className="flex-[2] flex items-center justify-center gap-2 bg-[#010694] hover:bg-[#1a1e8a] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm disabled:opacity-70 transform hover:scale-[1.02]"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {loading ? "Duke u ruajtur..." : "Ruaj Kategorinë e Problemit"}
            </button>
          </div>
        </form>
      </div>

      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
        <p className="text-xs text-blue-600 leading-relaxed">
          <b>Shënim:</b> Pas ruajtjes, Kategoria e problemit do të jetë e
          disponueshme në sistem.
        </p>
      </div>
    </div>
  );
}