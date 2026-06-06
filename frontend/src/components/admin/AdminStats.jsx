import { useEffect, useState } from "react";
import { staffService } from "../../services/staffService";

export default function AdminStats() {
  const [staffCount, setStaffCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching staff count...");

        const res = await staffService.getStaffMembers();

        setStaffCount(res.data.numberOfStaff);
      } catch (err) {
        console.error("Error fetching staff count", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Stafi" value={staffCount} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <h3 className="text-2xl font-semibold text-slate-900 mt-2">{value}</h3>
    </div>
  );
}
