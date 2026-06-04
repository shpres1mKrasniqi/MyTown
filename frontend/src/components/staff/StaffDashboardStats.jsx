import {
  ShoppingBag,
  AlertTriangle,
  MessageSquare,
  HandHelping,
} from "lucide-react";

export default function StaffDashboardStats({
  stats,
  eventsCount,
  setActivePage,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div
        onClick={() => setActivePage("event-list")}
        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between cursor-pointer"
      >
        <div>
          <p className="text-[11px] text-gray-400 uppercase">
            Evente Gjithsej
          </p>
          <p className="text-2xl font-black">{eventsCount}</p>
        </div>

        <div className="p-3 bg-blue-50 rounded-xl">
          <ShoppingBag size={18} />
        </div>
      </div>

      <div
        onClick={() => setActivePage("issues")}
        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between cursor-pointer"
      >
        <div>
          <p className="text-[11px] text-gray-400 uppercase">
            Issues
          </p>
          <p className="text-2xl font-black text-red-600">
            {stats.issuesCount}
          </p>
        </div>

        <div className="p-3 bg-red-50 rounded-xl">
          <AlertTriangle size={18} />
        </div>
      </div>

      <div
        onClick={() => setActivePage("meeting-requests")}
        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between cursor-pointer"
      >
        <div>
          <p className="text-[11px] text-gray-400 uppercase">
            Takime
          </p>
          <p className="text-2xl font-black text-amber-500">
            {stats.meetingsCount}
          </p>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl">
          <MessageSquare size={18} />
        </div>
      </div>

      <div
        onClick={() => setActivePage("proposals")}
        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between cursor-pointer"
      >
        <div>
          <p className="text-[11px] text-gray-400 uppercase">
            Propozime
          </p>
          <p className="text-2xl font-black text-purple-600">
            {stats.proposalsCount}
          </p>
        </div>

        <div className="p-3 bg-purple-50 rounded-xl">
          <HandHelping size={18} />
        </div>
      </div>
    </div>
  );
}
