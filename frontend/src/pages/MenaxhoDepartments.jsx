import { useEffect, useState } from "react";    
import { departmentService } from "../services/departmentService";
import {Link, useNavigate  } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import { Search, Edit2, Trash2, RefreshCw, Building2, Plus } from "lucide-react";

function MenaxhoDepartments() {
    const [depts, setDepts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState (false);
    const navigate = useNavigate();

    const fetchDepts = async()=> {
        setLoading(true);
        try{
            const res = await departmentService.getAll();
            setDepts(res.data);
        }catch{
            toast.error("Gabim gjate marrjes se te dhenave");
        }finally{
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchDepts();
    },[]);

    const filtered = depts.filter(d=>d.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()));

    const handleDelete = async (id, name) =>{
        if(!window.confirm(`A jeni i sigurt qe deshironi te fshini "${name}"?`)) return;
        try{
            await departmentService.delete(id);
            toast.success("Departmenti u fshi me sukses.");
            fetchDepts();
        }catch{
            toast.error("Fshirja deshtoi!");
        }
    };

    return (
    <div className="min-h-screen bg-[#0a0a0c] pb-24 text-slate-300">
      <div className="bg-gradient-to-b from-[#111114] to-[#0a0a0c] py-12 px-8 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
              Menaxho <span className="text-blue-500">Drejtoritë</span>
            </h1>
            <p className="text-slate-500 font-bold mt-2">Gjithsej {depts.length} drejtori në komunë</p>
          </div>
          <div className="flex gap-3">
             <button onClick={fetchDepts} className="p-4 bg-[#16161a] border border-slate-800 rounded-2xl text-blue-500 hover:bg-slate-800 transition-all shadow-xl">
                <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
             </button>
             <Link to="/AddDepartment" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-blue-900/20 transition-all">
                <Plus size={20} /> <span>SHTO TË RE</span>
             </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-8">
        <div className="bg-[#111114] p-4 rounded-3xl border border-slate-800/50 mb-8 shadow-2xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" />
            <input
              className="w-full pl-12 pr-4 py-5 rounded-2xl bg-[#0a0a0c] border border-slate-800 outline-none font-bold text-white focus:ring-2 focus:ring-blue-500/30 transition-all"
              placeholder="Kërko drejtorinë..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-[#111114] rounded-[2.5rem] border border-slate-800/50 overflow-hidden shadow-2xl">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-800/50">
              <tr className="text-slate-500 text-[10px] uppercase tracking-widest font-black">
                <th className="py-6 px-8 text-left">Departamenti</th>
                <th className="py-6 px-8 text-left">Përshkrimi</th>
                <th className="py-6 px-8 text-right">Veprimet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-blue-600/5 transition-all group">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-600/10 rounded-xl text-blue-500"><Building2 size={20} /></div>
                      <span className="font-black text-white text-lg italic">{d.name}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8 text-slate-400 font-medium max-w-md truncate">{d.description}</td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex justify-end gap-3">
                      <Link to={`/edit-department/${d.id}`} className="p-3 bg-[#1c1c21] rounded-xl text-slate-400 hover:text-blue-500 hover:border-blue-500/50 border border-transparent transition-all"><Edit2 size={18} /></Link>
                      <button onClick={() => handleDelete(d.id, d.name)} className="p-3 bg-[#1c1c21] rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-500/50 border border-transparent transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MenaxhoDepartments;
