import StaffDashboardStats from "./StaffDashboardStats";
import ProposalsChart from "../ProposalsChart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export default function StaffDashboardHome({
  loading,
  error,
  dbEvents,
  stats,
  setActivePage,
}) {
  // ----------------------------
  // EVENT STATUS CHART
  // ----------------------------
  const eventStatusData = [
    {
      name: "Aktive",
      value: dbEvents.filter((e) => e.status === 1).length,
    },
    {
      name: "Në pritje",
      value: dbEvents.filter((e) => e.status === 0).length,
    },
    {
      name: "Të mbyllura",
      value: dbEvents.filter((e) => e.status === 2).length,
    },
  ];

  // ----------------------------
  // ISSUES vs MEETINGS CHART
  // ----------------------------
  const issuesMeetingsData = [
    {
      name: "Issues",
      value: stats.issuesCount || 0,
    },
    {
      name: "Takime",
      value: stats.meetingsCount || 0,
    },
  ];

  return (
    <div className="space-y-6 w-full">

      {/* STATS */}
      <StaffDashboardStats
        stats={stats}
        eventsCount={dbEvents.length}
        setActivePage={setActivePage}
      />

      {/* MAIN CHART */}
      <div className="w-full">
        <ProposalsChart />
      </div>

      {/* EXTRA CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* EVENT STATUS PIE CHART */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold mb-4 text-slate-700">
            Statusi i Eventeve
          </h2>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventStatusData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {eventStatusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ISSUES vs MEETINGS BAR CHART */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold mb-4 text-slate-700">
            Issues vs Takime
          </h2>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issuesMeetingsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}