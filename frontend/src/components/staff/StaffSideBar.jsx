import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LogoutButton from "../LogoutButton";
import {
  LayoutDashboard,
  Plus,
  List,
  AlertTriangle,
  MessageSquare,
  CheckSquare,
  HandHelping,
  HouseIcon,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";

const MENU = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/staff-dashboard",
  },
  {
    key: "add-event",
    label: "Krijo Event",
    icon: Plus,
    path: "/add-event",
  },
  { key: "event-list", label: "Eventet", icon: List, path: "/staff/events" },
  {
    key: "issues",
    label: "Ankesat (Issues)",
    icon: AlertTriangle,
    path: "/issues",
  },
  {
    key: "manage-meetings",
    label: "Menaxho Takimet",
    icon: MessageSquare,
    path: "/manage-meetings",
  },
  {
    key: "proposals",
    label: "Projekt propozimet",
    icon: HandHelping,
    path: "/proposals",
  },
  {
    key: "add-project-proposal",
    label: "Shto Propozim",
    icon: Plus,
    path: "/add-project-proposal",
  },
  {
    key: "construction-permits",
    label: "Lejet ndërtimore",
    icon: HouseIcon,
    path: "/permits",
  },
  {
    key: "history",
    label: "Historiku",
    icon: Calendar,
    path: "/history",
  },
];

export default function StaffSidebar({ activePage, setActivePage }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    Cookies.remove("accessToken");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between">
      <div>
        <div
          className="flex h-16 items-center px-6 border-b border-slate-100 cursor-pointer"
          onClick={() => setActivePage("dashboard")}
        >
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-[#010694] text-white flex items-center justify-center rounded">
              ∞
            </div>
            <span className="text-lg font-extrabold text-slate-900">
              MYTOWN
            </span>
          </div>
        </div>

        <nav className="space-y-1 px-3 py-6">
          {MENU.map(({ key, label, icon: Icon }) => (
            <SidebarItem
              key={key}
              icon={<Icon size={20} />}
              label={label}
              active={activePage === key}
              onClick={() => setActivePage(key)}
            />
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#010694] text-white flex items-center justify-center text-xs font-bold">
            ST
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900">Staff</p>
            <p className="text-[10px] text-slate-500">Workspace</p>
          </div>
        </div>

        <LogoutButton showLabel={false} />
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-[#eff0ff] text-[#010694]"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
