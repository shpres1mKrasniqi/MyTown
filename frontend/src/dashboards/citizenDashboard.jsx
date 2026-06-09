import { useState, useEffect } from "react";
import { useCitizenNotifications } from "../pages/useCitizenNotifications";
import { departmentService } from "../services/departmentService";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { ProposalService } from "../services/proposalService";
import { meetingService } from "../services/meetingService";
import { constructionPermitsService } from "../services/constructionPermitsService";
import { IssueService } from "../services/IssueServices";
import CitizenChart from "../components/citizen/CitizenChart";
import {
  Building2,
  ListChecks,
  Clock,
  CheckCircle2,
} from "lucide-react"

function StatCard({ label, value, icon, color }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg
      transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
      bg-gradient-to-r ${color}`}
    >
      {/* glow effects */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full" />
      <div className="absolute bottom-[-20px] left-[-20px] w-28 h-28 bg-black opacity-10 rounded-full" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider opacity-80">
            {label}
          </p>
          <h3 className="text-3xl font-bold mt-1">{value}</h3>
        </div>

        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
          {icon}
        </div>
      </div>
    </div>
  );
};


export default function CitizenDashboard() {
  const [deptCount, setDeptCount] = useState(0);
  const navigate = useNavigate();

  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useCitizenNotifications();

  const [stats, setStats] = useState({
    requests: 0,
    pending: 0,
    completed: 0,
  });

 
  const normalize = (res) =>
    res?.data?.items ||
    res?.data?.data ||
    res?.data?.$values ||
    res?.data ||
    [];


  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await departmentService.getAll();
      setDeptCount(res.data.length);
    };

    fetchDepartments();
  }, []);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [proposalsRes, meetingsRes, permitsRes, issuesRes] =
          await Promise.all([
            ProposalService.getAll(),
            meetingService.getAll(),
            constructionPermitsService.getAll(),
            IssueService.getAll(),
          ]);

        const proposals = normalize(proposalsRes);
        const meetings = normalize(meetingsRes);
        const permits = normalize(permitsRes);
        const issues = normalize(issuesRes);

        
        const totalRequests =
          proposals.length +
          meetings.length +
          permits.length +
          issues.length;

       
        const pending =
          [...proposals, ...meetings, ...permits, ...issues].filter(
            (x) => Number(x.status) === 0 || x.status === "Pending"
          ).length;

       
        const completed =
          [...proposals, ...meetings, ...permits, ...issues].filter(
            (x) =>
              Number(x.status) === 1 ||
              x.status === "Approved" ||
              x.status === "Accepted"
          ).length;

        setStats({
          requests: totalRequests,
          pending,
          completed,
        });
      } catch (err) {
        console.error("Error loading stats:", err);
      }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  <StatCard
    label="Drejtoritë"
    value={deptCount}
    icon={<Building2 size={20} />}
    color="from-indigo-500 to-indigo-700"
  />

  <StatCard
    label="Kërkesat e mia"
    value={stats.requests}
    icon={<ListChecks size={20} />}
    color="from-emerald-500 to-emerald-700"
  />

  <StatCard
    label="Në pritje"
    value={stats.pending}
    icon={<Clock size={20} />}
    color="from-amber-500 to-orange-500"
  />

  <StatCard
    label="Të përfunduara"
    value={stats.completed}
    icon={<CheckCircle2 size={20} />}
    color="from-rose-500 to-red-600"
  />
</div>
      {/* CHARTS */}
      <CitizenChart />
    </div>
  );
}