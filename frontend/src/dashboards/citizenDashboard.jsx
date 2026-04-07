import { useEffect, useState } from "react";
import { departmentService } from "../services/departmentService";
import { Building2, FileText, Clock, CheckCircle } from "lucide-react";

import ShikoDepartments from "../pages/ShikoDepartments";

export default function CitizenDashboard() {
  const [deptCount, setDeptCount] = useState(0);
  const [showDepartments, setShowDepartments] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await departmentService.getAll();
        setDeptCount(res.data.length);
      } catch (err) {
        console.error("Gabim gjate marrjes se statistikave");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Citizen Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Mirë se vini, këtu mund të menaxhoni shërbimet tuaja.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Drejtoritë" value={deptCount} icon={<Building2 size={18} />} />
        <StatCard label="Kërkesat e mia" value="3" icon={<FileText size={18} />} />
        <StatCard label="Në pritje" value="1" icon={<Clock size={18} />} />
        <StatCard label="Të përfunduara" value="2" icon={<CheckCircle size={18} />} />
      </div>

      {/* BUTTON */}
      <div>
        <button
          onClick={() => setShowDepartments(!showDepartments)}
          className="flex items-center gap-2 bg-[#010694] text-white px-5 py-3 rounded-xl shadow hover:bg-[#0208c7] transition-all"
        >
          <Building2 size={18} />
          {showDepartments ? "Fshih Drejtoritë" : "Shiko Drejtoritë"}
        </button>
      </div>

      {/* CONDITIONAL RENDER */}
      {showDepartments && (
        <div className="mt-6">
          <ShikoDepartments />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <h3 className="text-2xl font-semibold text-slate-900 mt-2">
          {value}
        </h3>
      </div>

      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#eff0ff] text-[#010694]">
        {icon}
      </div>
    </div>
  );
}