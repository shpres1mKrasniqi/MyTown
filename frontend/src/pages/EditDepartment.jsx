import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";  
import { departmentService } from "../services/departmentService";
import { toast } from "react-toastify"; 
import {ArrowLeft, Save, Building2, AlignLeft, Trophy} from "lucide-react";


function EditDepartment() {
    const{id} = useParams();
    const [form, setForm] = useState({
        name:"",
        description:""
    });
    const[loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchDep = async () => {
            try{
                const res = await departmentService.getById(id);
                setForm({
                    name: res.data.name,
                    description: res.data.description
                });
            }catch{
                toast.error("Gabim gjate marrjes se te dhenave!")
            }
        };
        fetchDep();
    },[id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            await departmentService.update(id, form);
            toast.success("Departmenti u perditesua me sukses!");
            navigate("/menaxhoDepartments");
        }catch{
            toast.error("Perditesimi deshtoi!");
        }finally{
            setLoading(false);
        }
    };

   return (
    <div className="min-h-screen bg-[#0a0a0c] p-4 md:p-6 text-slate-300">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate("/menaxhoDepartment")} className="flex items-center gap-2 text-slate-500 hover:text-blue-500 mb-6 transition-all font-bold">
          <ArrowLeft size={20} /> <span>Kthehu te lista</span>
        </button>

        <h1 className="text-3xl font-black text-white italic uppercase mb-8">
          Edito <span className="text-blue-500">Departamentin</span>
        </h1>

        <div className="bg-[#111114] rounded-[2.5rem] shadow-2xl border border-slate-800/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-2">
                <Building2 size={16} className="text-blue-500" /> Emri
              </label>
              <input
                className="w-full px-5 py-4 bg-[#16161a] border-2 border-transparent focus:border-blue-500/20 rounded-[1.5rem] outline-none text-white font-bold"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-2">
                <AlignLeft size={16} className="text-blue-500" /> Përshkrimi
              </label>
              <textarea
                className="w-full h-40 px-5 py-4 bg-[#16161a] border-2 border-transparent focus:border-blue-500/20 rounded-[1.5rem] outline-none text-white font-bold resize-none"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all">
                {loading ? "Duke ruajtur..." : "Ruaj Ndryshimet"}
              </button>
              <button type="button" onClick={() => navigate("/menaxhoDepartment")} className="px-8 py-5 bg-slate-800/50 border-2 border-slate-800 text-slate-400 font-black rounded-2xl hover:bg-slate-800 transition-all">
                Anulo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditDepartment;