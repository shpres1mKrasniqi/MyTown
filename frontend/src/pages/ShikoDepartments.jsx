import { useEffect, useState } from "react";    
import { departmentService } from "../services/departmentService";
import { Building2, Info } from "lucide-react";

function ShikoDepartments () {

    const [depts, setDepts] = useState([]);

    useEffect(() => {
        departmentService.getAll().then(res => setDepts(res.data));

    },[]);

    return (
    <div className="min-h-screen bg-[#0a0a0c] p-8 text-slate-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-12 text-center md:text-left">
          Drejtoritë e <span className="text-blue-500">Komunës</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {depts.map(d => (
            <div key={d.id} className="group bg-[#111114] p-8 rounded-[2.5rem] border border-slate-800/50 shadow-2xl hover:border-blue-500/40 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                 <Building2 size={80} className="text-blue-500" />
              </div>
              
              <div className="h-14 w-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 border border-blue-500/20 shadow-lg shadow-blue-900/20">
                 <Info size={28} />
              </div>
              
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-4 group-hover:text-blue-400 transition-colors">
                {d.name}
              </h3>
              
              <p className="text-slate-500 font-bold leading-relaxed italic">
                {d.description}
              </p>
              
              <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Komuna e MyTown</span>
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShikoDrejtorite;
