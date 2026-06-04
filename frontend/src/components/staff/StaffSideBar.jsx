import {
  Calendar,
  Plus,
  List,
  LayoutDashboard,
  Settings,
  LogOut,
  AlertTriangle,
  MessageSquare,
  CheckSquare,
  HandHelping,
  HouseIcon,
} from "lucide-react";

const MENU = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "add-event", label: "Krijo Event", icon: Plus },
  { key: "event-list", label: "Eventet", icon: List },
  { key: "issues", label: "Issues (Ankesat)", icon: AlertTriangle },
  { key: "manage-meetings", label: "Menaxho Takimet", icon: MessageSquare },
  { key: "meeting-requests", label: "Lista takimeve", icon: CheckSquare },
  { key: "proposals", label: " Projekt propozimet", icon: HandHelping },
  { key: "construction-permits", label: "Lejet ndertimore", icon: HouseIcon },
  { key: "history", label: "Historiku", icon: Calendar },
];

export default function StaffSidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-64 bg-[#202d60] text-gray-300 flex flex-col justify-between flex-shrink-0 hidden md:flex border-r border-gray-800">
      <div>
        <div className="px-6 py-6 border-b border-white/5">
          <h2 className="text-white font-black text-sm tracking-wider uppercase">
            STAFF PANEL v1.0
          </h2>
        </div>

        <nav className="px-4 py-6 space-y-1">
          {MENU.map(({ key, label, icon: Icon }) => {
            const isActive = activePage === key;

            return (
              <button
                key={key}
                onClick={() => setActivePage(key)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-white text-[#202d60] font-bold shadow-md"
                    : "hover:bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span className="text-xs font-semibold">{label}</span>
                </div>

                {isActive && <span>›</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/5 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl">
          <Settings size={16} />
          <span>Rregullimet</span>
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-xl">
          <LogOut size={16} />
          <span>Dil</span>
        </button>
      </div>
    </aside>
  );
}
