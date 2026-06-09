import { useEffect, useState } from "react";
import { ProposalService } from "../../services/proposalService";
import { meetingService } from "../../services/meetingService";
import { constructionPermitsService } from "../../services/constructionPermitsService";
import { eventService } from "../../services/eventService";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#f59e0b", "#10b981", "#ef4444"];

export default function CitizenChart() {
  const [activityData, setActivityData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const [proposalsRes, meetingsRes, permitsRes, eventsRes] =
        await Promise.all([
          ProposalService.getAll(),
          meetingService.getAll(),
          constructionPermitsService.getAll(),
          eventService.getAll(),
        ]);

      const proposals = proposalsRes.data || [];
      const meetings = meetingsRes.data?.items || meetingsRes.data || [];
      const permits = permitsRes.data || [];
      const events = eventsRes.data || [];

      setActivityData([
        {
          name: "Propozime",
          value: proposals.length,
        },
        {
          name: "Takime",
          value: meetings.length,
        },
        {
          name: "Leje",
          value: permits.length,
        },
        {
          name: "Evente",
          value: events.length,
        },
      ]);

      const pending =
        meetings.filter((m) =>Number(m.status) === 0).length +
        permits.filter((p) =>Number(p.status) === 0).length;

      const approved =
        meetings.filter((m) => m.status === 1).length +
        permits.filter((p) => p.status === 1).length;

      const rejected =
        meetings.filter((m) => m.status === 2).length +
        permits.filter((p) => p.status === 2).length;

      setStatusData([
        { name: "Në pritje", value: pending },
        { name: "Pranuar", value: approved },
        { name: "Refuzuar", value: rejected },
      ]);
      const months = [
  "Jan",
  "Shk",
  "Mar",
  "Pri",
  "Maj",
  "Qer",
  "Kor",
  "Gush",
  "Sht",
  "Tet",
  "Nën",
  "Dhj",
];

const monthlyStats = months.map((month) => ({
  month,
  proposals: 0,
  meetings: 0,
  permits: 0,
  events: 0,
}));

proposals.forEach((p) => {
  if (p.createdAt) {
    const month = new Date(p.createdAt).getMonth();
    monthlyStats[month].proposals++;
  }
});

meetings.forEach((m) => {
  if (m.createdAt) {
    const month = new Date(m.createdAt).getMonth();
    monthlyStats[month].meetings++;
  }
});

permits.forEach((p) => {
  if (p.createdAt) {
    const month = new Date(p.createdAt).getMonth();
    monthlyStats[month].permits++;
  }
});

events.forEach((e) => {
  if (e.createdAt) {
    const month = new Date(e.createdAt).getMonth();
    monthlyStats[month].events++;
  }
});

setMonthlyData(monthlyStats);
console.log("STATUS CHECK meetings:", meetings.map(m => m.status));
console.log("STATUS CHECK proposals:", proposals.map(p => p.status));
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Activity Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Aktivitetet e Mia
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#010694" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Statusi i Kërkesave
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              dataKey="value"
              label
            >
              {statusData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
  <h2 className="text-lg font-semibold mb-4">
    Aktiviteti Mujor
  </h2>

  <ResponsiveContainer width="100%" height={350}>
    <LineChart data={monthlyData}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="month" />

      <YAxis />

      <Tooltip />

      <Legend />

      <Line
        type="monotone"
        dataKey="permits"
        stroke="#f59e0b"
        strokeWidth={3}
        name="Leje"
      />

      <Line
        type="monotone"
        dataKey="events"
        stroke="#ef4444"
        strokeWidth={3}
        name="Evente"
      />
    </LineChart>
  </ResponsiveContainer>
</div>
    </div>
  );
}