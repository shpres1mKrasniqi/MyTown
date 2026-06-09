import {
  ShoppingBag,
  AlertTriangle,
  MessageSquare,
  HandHelping,
} from "lucide-react";

function StatCard({ title, value, icon, color, onClick, subtitle }) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer rounded-2xl p-5 text-white shadow-lg
      transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
      bg-gradient-to-r ${color}`}
    >
      {/* glow effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full" />
      <div className="absolute bottom-[-20px] left-[-20px] w-28 h-28 bg-black opacity-10 rounded-full" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider opacity-80">
            {title}
          </p>

          <h3 className="text-3xl font-extrabold mt-1">{value}</h3>

          {subtitle && (
            <p className="text-xs opacity-70 mt-1">{subtitle}</p>
          )}
        </div>

        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function StaffDashboardStats({
  stats,
  eventsCount,
  setActivePage,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

      <StatCard
        title="Evente Gjithsej"
        value={eventsCount}
        subtitle="Aktivitete aktive"
        icon={<ShoppingBag size={20} />}
        color="from-blue-500 to-indigo-600"
        onClick={() => setActivePage("event-list")}
      />

      <StatCard
        title="Issues"
        value={stats.issuesCount}
        subtitle="Raporte nga qytetarët"
        icon={<AlertTriangle size={20} />}
        color="from-red-500 to-rose-600"
        onClick={() => setActivePage("issues")}
      />

      <StatCard
        title="Takime"
        value={stats.meetingsCount}
        subtitle="Kërkesa për takime"
        icon={<MessageSquare size={20} />}
        color="from-amber-500 to-orange-500"
        onClick={() => setActivePage("meeting-requests")}
      />

      <StatCard
        title="Propozime"
        value={stats.proposalsCount}
        subtitle="Ide nga qytetarët"
        icon={<HandHelping size={20} />}
        color="from-purple-500 to-fuchsia-600"
        onClick={() => setActivePage("proposals")}
      />

    </div>
  );
}