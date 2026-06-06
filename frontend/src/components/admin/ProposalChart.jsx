import React, { useEffect, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import { ProposalService } from "../../services/proposalService";
import { ProposalVoteService } from "../../services/voteService";
import { BarChart2 } from "lucide-react";

const COLORS = ["#10b981", "#ef4444"];

const ProposalsChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChartData = useCallback(async () => {
    try {
      const res = await ProposalService.getAll();
      const proposals = res.data || [];

      let totalPro = 0;
      let totalKunder = 0;

      await Promise.all(
        proposals.map(async (p) => {
          try {
            const voteRes = await ProposalVoteService.getVotes(p.id);
            totalPro += voteRes.data.forVotes || 0;
            totalKunder += voteRes.data.againstVotes || 0;
          } catch {}
        }),
      );

      setChartData([
        { name: "Pro", value: totalPro },
        { name: "Kundër", value: totalKunder },
      ]);
    } catch (err) {
      console.error("Chart error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChartData();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7214/hubs/votat")
      .withAutomaticReconnect()
      .build();

    connection.on("VotimiUkrye", () => {
      fetchChartData();
    });

    connection.start().catch(console.error);

    return () => connection.stop();
  }, [fetchChartData]);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-[320px] flex items-center justify-center text-slate-500">
        Duke ngarkuar grafikun...
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart2 className="text-indigo-600" size={20} />
          <h2 className="text-sm font-semibold text-slate-800">
            Votat e Propozimeve
          </h2>
        </div>

        <div className="flex gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
            Pro
          </span>
          <span className="px-2 py-1 rounded-full bg-red-50 text-red-600">
            Kundër
          </span>
        </div>
      </div>

      {/* CHART */}
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              }}
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProposalsChart;
