import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Settings
} from "lucide-react";

import MenaxhoDepartments from "../pages/MenaxhoDepartments";
import { departmentService } from "../services/departmentService";

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("overview");
  const [deptCount, setDeptCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await departmentService.getAll();
      setDeptCount(res.data.length);
    } catch (err) {
      toast.error("Gabim gjate marrjes se statistikave");
    }
  };

  fetchStats();
}, []);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    navigate("/login");
  };

  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Overview
          </h1>
          <p className="text-sm text-slate-500">
            Welcome back, ja çfarë po ndodh sot.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Drejtoritë" value={deptCount} />
        <StatCard label="Përdoruesit" value="1.2k" />
        <StatCard label="Kërkesat" value="48" />
        <StatCard label="Aktive" value="95%" />
      </div>
    </>
  );
}
function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <h3 className="text-2xl font-semibold text-slate-900 mt-2">
        {value}
      </h3>
    </div>
  );
}