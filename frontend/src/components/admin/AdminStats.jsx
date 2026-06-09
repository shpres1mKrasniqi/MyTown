import { useEffect, useState } from "react";
import { staffService } from "../../services/staffService";
import { departmentService } from "../../services/departmentService";
import { komunaService } from "../../services/komunaService";
import { ProposalService } from "../../services/proposalService";

import { Users,Building2, MapPin, FileText } from "lucide-react";

export default function AdminStats() {
  const [stats, setStats] = useState({
    staff: 0,
    departments: 0,
    municipalities: 0,
    proposals: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [staffRes, deptRes, muniRes, proposalRes] =
          await Promise.all([
            staffService.getAll(),
            departmentService.getAll(),
            komunaService.getAll(),
            ProposalService.getAll(),
          ]);

        setStats({
          staff: staffRes.data?.length || 0,
          departments: deptRes.data?.length || 0,
          municipalities: muniRes.data?.length || 0,
          proposals: proposalRes.data?.length || 0,
        });
      } catch (err) {
        console.error("Error fetching admin stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

      <PremiumCard
        label="Stafi"
        value={stats.staff}
        icon={<Users size={22} />}
        color="from-indigo-500 to-indigo-700"
      />

      <PremiumCard
        label="Drejtoritë"
        value={stats.departments}
        icon={<Building2 size={22} />}
        color="from-emerald-500 to-emerald-700"
      />

      <PremiumCard
        label="Komunat"
        value={stats.municipalities}
        icon={<MapPin size={22} />}
        color="from-amber-500 to-orange-600"
      />

      <PremiumCard
        label="Propozimet"
        value={stats.proposals}
        icon={<FileText size={22} />}
        color="from-rose-500 to-red-600"
      />

    </div>
  );
}

function PremiumCard({ label, value, icon, color }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg transition transform hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-r ${color}`}
    >
      {/* glow effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full" />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs opacity-80">{label}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>

        <div className="p-3 bg-white/20 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}