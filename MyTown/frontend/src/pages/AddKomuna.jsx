import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { komunaService } from "../services/komunaService";
import { toast } from "react-toastify";
import { ArrowLeft, Save, MapPin, AlignLeft, Loader2 } from "lucide-react";

export default function AddKomuna() {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.name.length < 3) {
      toast.error("Emri duhet të ketë së paku 3 karaktere");
      return;
    }

    setLoading(true);
    try {
      await komunaService.create(form);
      toast.success("Komuna u krijua me sukses");
      navigate("/MenaxhoKomunat");
    } catch (err) {
      toast.error(err.response?.data?.message || "Shtimi dështoi");
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
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Kthehu mbrapa
        </button>
        <h1 className="text-2xl font-semibold text-slate-900">Shto Komunë të re</h1>
        <p className="text-sm text-slate-500">
          Plotësoni të dhënat më poshtë për të krijuar një komunë të re në sistem.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MapPin size={16} className="text-[#010694]" /> 
              Emri i Komunës
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/20 focus:border-[#010694] transition-all text-sm"
              placeholder="Psh. Komuna e Prishtinës"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <AlignLeft size={16} className="text-[#010694]" /> 
              Përshkrimi i shkurtër
            </label>
            <textarea
              rows="4"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/20 focus:border-[#010694] transition-all text-sm resize-none"
              placeholder="Shpjegoni detaje shtesë rreth kësaj komune..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="pt-4 flex items-center gap-3">
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
              className="flex-[2] flex items-center justify-center gap-2 bg-[#010694] hover:bg-[#1a1e8a] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm disabled:opacity-70 transform hover:scale-[1.02]"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {loading ? "Duke u ruajtur..." : "Ruaj Komunën"}
            </button>
          </div>
        </form>
      </div>

      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
        <p className="text-xs text-blue-600 leading-relaxed">
          <b>Shënim:</b> Pas ruajtjes, komuna do të jetë e disponueshme në sistem për t'u menaxhuar dhe për të lidhur staf apo drejtori me të.
        </p>
      </div>
    </div>
  );
}
