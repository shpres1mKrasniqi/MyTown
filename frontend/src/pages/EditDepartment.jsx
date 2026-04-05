import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { departmentService } from "../services/departmentService";
import { toast } from "react-toastify";
import { ArrowLeft, Save, Building2, AlignLeft, Loader2, X } from "lucide-react";

export default function EditDepartment() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDep = async () => {
      try {
        const res = await departmentService.getById(id);
        setForm({
          name: res.data.name,
          description: res.data.description,
        });
      } catch {
        toast.error("Gabim gjatë marrjes së të dhënave!");
        navigate("/menaxhoDepartments");
      } finally {
        setFetching(false);
      }
    };
    fetchDep();
  }, [id, navigate]);

  

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
      await departmentService.update(id, form);
      toast.success("Departamenti u përditësua me sukses!");
      navigate("/admin-dashboard"); 
    } catch {
      toast.error("Përditësimi dështoi!");
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-semibold text-slate-900">Edito Departamentin</h1>
        <p className="text-sm text-slate-500">
          Modifiko detajet e drejtorisë <span className="font-bold text-slate-700">"{form.name}"</span>.
        </p>
      </div>

    
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Building2 size={16} className="text-[#010694]" /> 
              Emri i Departamentit
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/5 focus:border-[#010694] transition-all text-sm font-medium text-slate-900"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

         
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <AlignLeft size={16} className="text-[#010694]" /> 
              Përshkrimi
            </label>
            <textarea
              rows="5"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010694]/5 focus:border-[#010694] transition-all text-sm text-slate-600 resize-none font-medium"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

         
          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/menaxhoDepartments")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all"
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