import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useCitizenNotifications } from "../pages/useCitizenNotifications";
import { departmentService } from "../services/departmentService";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <h3 className="text-2xl font-semibold text-slate-900 mt-2">{value}</h3>
    </div>
  );
}

export default function CitizenDashboard() {
  const [deptCount, setDeptCount] = useState(0);
  const navigate = useNavigate();

  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useCitizenNotifications();

  useEffect(() => {
    const fetchStats = async () => {
      const res = await departmentService.getAll();
      setDeptCount(res.data.length);
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Citizen Dashboard</h1>
          <p className="text-sm text-slate-500">Overview</p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg border border-slate-200 text-sm"
        >
          Çkyçu
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Drejtoritë" value={deptCount} />
        <StatCard label="Kërkesat e mia" value="3" />
        <StatCard label="Në pritje" value="1" />
        <StatCard label="Të përfunduara" value="2" />
      </div>
    </div>
  );
}
