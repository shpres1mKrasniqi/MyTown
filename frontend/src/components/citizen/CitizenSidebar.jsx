import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LogoutButton from "../LogoutButton";
import {
  LayoutDashboard,
  Plus,
  AlertTriangle,
  MessageSquare,
  HandHelping,
  HouseIcon,
  Calendar,
  List,
  Settings,
  LogOut,
  CheckSquare,
} from "lucide-react";

const MENU = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/citizen-dashboard",
  },
  {
    key: "add-issue",
    label: "Krijo Ankesë",
    icon: Plus,
    path: "/citizen-dashboard/add-issue",
  },
  {
    key: "issues",
    label: "Ankesat",
    icon: AlertTriangle,
    path: "/citizen-dashboard/issues",
  },
  {
    key: "meeting-request",
    label: "Kërko Takim",
    icon: MessageSquare,
    path: "/citizen-dashboard/add-meeting-request",
  },
  {
    key: "manage-meetings",
    label: "Menaxho Takimet",
    icon: MessageSquare,
    path: "/manage-meetings",
  },
  {
    key: "proposals",
    label: "Projekt Propozimet",
    icon: HandHelping,
    path: "/citizen-dashboard/lista-propozimeve",
  },
    {
    key: "add-permits",
    label: "Kërko leje për ndërtim",
    icon: Plus,
    path: "/citizen-dashboard/add-construction-permit-request",
  },
  {
    key: "permits",
    label: "Lista e lejeve të ndërtimit",
    icon: HouseIcon,
    path: "/citizen-dashboard/construction-permits",
  },
  {
    key: "events",
    label: "Evente",
    icon: Calendar,
    path: "/citizen-dashboard/events",
  },
];

export default function CitizenSidebar({ activePage }) {
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
        {/* LOGO */}
        <div
          className="flex h-16 items-center px-6 border-b border-slate-100 cursor-pointer"
          onClick={() => navigate("/citizen-dashboard")}
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

        {/* MENU */}
        <nav className="space-y-1 px-3 py-6">
          {MENU.map(({ key, label, icon: Icon, path }) => (
            <SidebarItem
              key={key}
              icon={<Icon size={20} />}
              label={label}
              active={activePage === key}
              onClick={() => navigate(path)}
            />
          ))}
        </nav>
      </div>

      {/* FOOTER */}
      <div className="border-t border-slate-100 p-4 flex justify-between items-center">
        <div>
          <p className="text-xs font-semibold">Citizen</p>
          <p className="text-[10px] text-slate-500">Portal</p>
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
