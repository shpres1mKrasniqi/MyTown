import { useState } from "react";
import { departmentService } from "../services/departmentService";  
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Save, Building2, AlignLeft } from "lucide-react";

function AddDepartment() {
    const [form, setForm] = useState({
        name:"",
        description:""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
         if (form.name.length < 3 && form.name.length >=100) {
        toast.error("Emri duhet te kete min 3 karaktere dhe max 100 karaktere");
        return;
    }

    if (form.description.length < 10 && form.description.length >= 500) {
        toast.error("Pershkrimi duhet te kete min 10 karaktere dhe max 500 karaktere");
        return;
    }

    setLoading(true);

        try{

            await departmentService.create(form);
            toast.success("Departmenti u krijua me sukses");
            navigate("/menaxhoDepartments")
            
        }catch(err){
            console.log("Gabimi:", err);
            toast.error(err.response?.data?.message || "Shtimi deshtoi");
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0c] p-4 md:p-6 text-slate-300">
            <div className="max-w-2xl mx-auto">
                <button
                    type="button" // Sigurohu që është type button që të mos bëjë submit formën
                    onClick={() => navigate(-1)} // Kthehet te faqja e kaluar
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-500 mb-6 transition-all font-bold"
                >
                    <ArrowLeft size={20} />
                    <span>Kthehu mbrapa</span>
                </button>

                <h1 className="text-3xl font-black text-white italic uppercase tracking-tight mb-8">
                    Shto <span className="text-blue-500">Departament të ri</span>
                </h1>

                <div className="bg-[#111114] rounded-[2.5rem] shadow-2xl border border-slate-800/50 p-6 md:p-8 text-left">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-400 ml-1">
                                <Building2 size={16} className="text-blue-500" /> Emri i Departamentit
                            </label>
                            <input
                                className="w-full px-5 py-4 bg-[#16161a] border-2 border-transparent focus:border-blue-500/20 focus:bg-[#1c1c21] rounded-[1.5rem] outline-none transition-all font-bold text-white shadow-inner"
                                placeholder="Psh. Drejtoria e Arsimit"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-400 ml-1">
                                <AlignLeft size={16} className="text-blue-500" /> Përshkrimi
                            </label>
                            <textarea
                                className="w-full h-32 px-5 py-4 bg-[#16161a] border-2 border-transparent focus:border-blue-500/20 focus:bg-[#1c1c21] rounded-[1.5rem] outline-none transition-all font-bold text-white shadow-inner resize-none"
                                placeholder="Shkruani një përshkrim të shkurtër..."
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 active:scale-95 cursor-pointer"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    Duke u ruajtur...
                                </span>
                            ) : (
                                <>
                                    <Save size={20} />
                                    <span>Ruaj Departamentin</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default AddDepartment;