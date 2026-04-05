import { useEffect, useState } from "react";
import { departmentService } from "../services/departmentService";
import { Building2, ArrowRight, MapPin } from "lucide-react";

export default function ShikoDepartments() {
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departmentService.getAll()
      .then(res => setDepts(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-900">Drejtoritë e Komunës</h1>
        <p className="text-slate-500 mt-2">Informohuni rreth departamenteve dhe shërbimeve që ofrojmë.</p>
      </div>

      {/* GRID E DEPARTAMENTEVE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {depts.map((d) => (
          <div 
            key={d.id} 
            className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#010694]/20 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 bg-[#eff0ff] text-[#010694] rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Building2 size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#010694] transition-colors">
                {d.name}
              </h3>
              
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                {d.description || "Ky departament mbulon kërkesat specifike të qytetarëve në nivel komunal."}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <MapPin size={12} />
                Objekti Kryesor
              </div>
              <button className="text-[#010694] p-2 bg-slate-50 rounded-lg group-hover:bg-[#010694] group-hover:text-white transition-all">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}