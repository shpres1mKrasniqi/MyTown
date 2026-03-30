import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { departmentService } from "../services/departmentService";
import { komunaService } from "../services/komunaService";
import { toast } from "react-toastify";
import { ArrowLeft, Save, Building2, AlignLeft, Loader2, MapPin } from "lucide-react";

export default function AddDepartment() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    komunaId: "",
  });

  const [komunas, setKomunas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKomunas = async () => {
      try {
        const res = await komunaService.getAll();
        setKomunas(res.data);
      } catch (err) {
        toast.error("Gabim gjatë marrjes së komunave");
      }
    };
    fetchKomunas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    if (form.name.length < 3 || form.name.length > 100) {
      toast.error("Emri duhet të ketë 3-100 karaktere");
      return;
    }

    if (form.description.length < 10 || form.description.length > 500) {
      toast.error("Përshkrimi duhet të ketë 10-500 karaktere");
      return;
    }

    if (!form.komunaId) {
      toast.error("Zgjidhni një komunë");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        komunaId: parseInt(form.komunaId, 10)
      };
      await departmentService.create(payload);
      toast.success("Departamenti u krijua me sukses");
      navigate("/menaxhoDepartments");
    } catch (err) {
      toast.error(err.response?.data?.message || "Shtimi dështoi");
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-semibold text-slate-900">Shto Drejtori të re</h1>
        <p className="text-sm text-slate-500">
          Plotësoni të dhënat më poshtë për të krijuar një departament të ri në sistem.
        </p>
      </div>

     
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
    
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MapPin size={16} className="text-[#010694]" /> 
              Zgjedh Komunën
            </label>
            <select
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/5 focus:border-[#010694] transition-all text-sm"
              value={form.komunaId}
              onChange={(e) => setForm({ ...form, komunaId: e.target.value })}
              required
            >
              <option value="" disabled>Selektoni një komunë</option>
              {komunas.map((k) => (
                <option key={k.id} value={k.id}>{k.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Building2 size={16} className="text-[#010694]" /> 
              Emri i Drejtorisë
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/5 focus:border-[#010694] transition-all text-sm"
              placeholder="Psh. Drejtoria e Urbanizmit"
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
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/5 focus:border-[#010694] transition-all text-sm resize-none"
              placeholder="Shpjegoni fushëveprimtarinë e kësaj drejtorie..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
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
          <b>Shënim:</b> Pas ruajtjes, departamenti do të jetë i dukshëm për qytetarët dhe stafi do të ketë mundësi të caktohet në këtë drejtori.
        </p>
      </div>
    </div>
  );
}