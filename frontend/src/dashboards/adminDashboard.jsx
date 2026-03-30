import { useEffect, useState } from "react";
import { departmentService } from "../services/departmentService";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [deptCount, setDeptCount] = useState(0);

  useEffect(() => {
   const fetchStats = async () => {
        try{
            const res = await departmentService.getAll();
            setDeptCount(res.data.length);
        }catch(err){
            toast.error("Gabim gjate marrjes se statistikave", err);
        }
    };
    fetchStats();
  },[]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Overview
          </h1>
          <p className="text-sm text-slate-500">
            Welcome back, ja çfarë po ndodh sot.
          </p>
        </div>

        <button className="bg-[#010694] hover:bg-[#2220aa] text-white px-4 py-2 rounded-lg text-sm transition-all shadow-sm transform hover:scale-105">
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Drejtoritë" value={deptCount} />
        <StatCard label="Përdoruesit" value="1.2k" />
        <StatCard label="Kërkesat" value="48" />
        <StatCard label="Aktive" value="95%" />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transform hover:scale-105 transition-all">
      <p className="text-xs text-slate-500">{label}</p>
      <h3 className="text-2xl font-semibold text-slate-900 mt-2">
        {value}
      </h3>
    </div>
  );
}