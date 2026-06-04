import React, { useEffect, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ProposalService } from "../services/proposalService";
import { ProposalVoteService } from "../services/voteService";
import { BarChart2 } from "lucide-react";

const ProposalsChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChartData = useCallback(async () => {
    try {
      const res = await ProposalService.getAll();
      const proposals = res.data || [];
      
      const dataWithVotes = await Promise.all(
        proposals.map(async (p) => {
          try {
            const voteRes = await ProposalVoteService.getVotes(p.id);
            return {
              name: p.title.length > 15 ? p.title.substring(0, 15) + "..." : p.title,
              pro: voteRes.data.forVotes || 0,
              kunder: voteRes.data.againstVotes || 0,
            };
          } catch {
            return { name: p.title, pro: 0, kunder: 0 };
          }
        })
      );
      setChartData(dataWithVotes);
    } catch (err) {
      console.error("Gabim në grafik:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChartData();

    // Lidhja me SignalR për përditësim real-time
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7214/hubs/votat")
      .withAutomaticReconnect()
      .build();

    connection.on("VotimiUkrye", () => {
      fetchChartData();
    });

    connection.start().catch(err => console.error("SignalR Dashboard Error:", err));

    return () => {
      connection.stop();
    };
  }, [fetchChartData]);

  if (loading) return <div className="h-40 flex items-center justify-center">Duke ngarkuar grafikun...</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6 border-b pb-2">
        <BarChart2 className="text-blue-600" size={20} />
        <h2 className="text-lg font-bold text-gray-800">Gara e Projekt Propozimeve (Votat Live)</h2>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend />
            <Bar dataKey="pro" fill="#10b981" name="Vota Pro" radius={[4, 4, 0, 0]} barSize={40} />
            <Bar dataKey="kunder" fill="#ef4444" name="Vota Kundër" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProposalsChart;