import StaffDashboardStats from "./StaffDashboardStats";
import ProposalsChart from "../ProposalsChart"; // Sigurohu që path-i këtu përputhet me vendndodhjen e grafikut
import {
  Calendar,
  MapPin,
  ShoppingBag,
  AlertTriangle,
  MessageSquare,
  HandHelping,
} from "lucide-react";

export default function StaffDashboardHome({
  loading,
  error,
  dbEvents,
  stats,
  setActivePage,
}) {
  return (
    <div className="space-y-6 w-full">
      {/* Seksioni i Statistikave sipër */}
      <StaffDashboardStats
        stats={stats}
        eventsCount={dbEvents.length}
        setActivePage={setActivePage}
      />

      {/* Grafiku i Propozimeve shfaqet këtu, poshtë statistikave */}
      <div className="w-full">
        <ProposalsChart />
      </div>
      
      {/* Nëse ke ndonjë listë të eventeve të fundit apo tabelë tjetër, mund ta vendosësh këtu poshtë */}
    </div>
  );
}