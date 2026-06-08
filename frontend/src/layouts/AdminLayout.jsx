import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { logout } from "../services/authService";
import LogoutButton from "../components/LogoutButton";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Settings,
  MapPin,
  Users,
  PlusSquare,
  PlusSquareIcon,
  AlertTriangle,
  Lightbulb,
  Calendar,
  MessageSquare,
  Hammer,
  LogOutIcon,
} from "lucide-react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    Cookies.remove("accessToken");
    navigate("/login", { replace: true });
  };

  const getActiveView = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes("komuna")) return "komunat";
    if (path.includes("department")) return "manage";
    if (path.includes("issue")) return "issues";
    if (path.includes("propozim")) return "propozime";
    if (path.includes("event")) return "events";
    if (path.includes("meeting")) return "meetings";
    if (path.includes("permit")) return "permits";
    return "overview";
  };

  const activeView = getActiveView();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-slate-800">
      {/* SIDEBAR */}
      {/* BACKDROP (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
              fixed md:static z-50
              top-0 left-0 h-full w-64
              bg-white border-r border-slate-200
              flex flex-col justify-between

              transform transition-transform duration-200
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
      >
        {/* LOGO */}
        <div>
          <div
            className="flex h-16 items-center px-6 border-b border-slate-100 cursor-pointer"
            onClick={() => navigate("/admin-dashboard")}
          >
            <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/admin-dashboard")}
              >
                <div className="h-6 w-6 bg-[#010694] text-white flex items-center justify-center rounded">
                  ∞
                </div>
                <span className="text-lg font-extrabold text-slate-900">
                  MYTOWN
                </span>
              </div>

              {/* CLOSE BUTTON (mobile only) */}
              <button
                className="md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* NAV */}
          <nav className="space-y-1 px-3 py-6 overflow-y-auto max-h-[calc(100vh-120px)]">
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              active={activeView === "overview"}
              onClick={() => navigate("/admin-dashboard")}
            />

            <SidebarItem
              icon={<Building2 size={20} />}
              label="Drejtoritë"
              active={activeView === "manage"}
              onClick={() => navigate("/MenaxhoDepartments")}
            />

            <SidebarItem
              icon={<MapPin size={20} />}
              label="Komunat"
              active={activeView === "komunat"}
              onClick={() => navigate("/MenaxhoKomunat")}
            />

            <SidebarItem
              icon={
                <Users
                  size={20}
                  className="text-blue-400 group-hover:text-white transition-colors"
                />
              }
              label="Menaxho Stafin"
              onClick={() => navigate("/manage-staff")}
            />
            <SidebarItem
              icon={
                <PlusSquareIcon
                  size={20}
                  className="text-blue-400 group-hover:text-white transition-colors"
                />
              }
              label="Shto Kategori te problemit"
              onClick={() => navigate("/add-issueCategory")}
            />

            <SidebarItem
              icon={<AlertTriangle size={20} />}
              label="Ankesat (Issues)"
              active={activeView === "issues"}
              onClick={() => navigate("/manage-issues")}
            />

            <SidebarItem
              icon={<Lightbulb size={20} />}
              label="Propozimet"
              active={activeView === "propozime"}
              onClick={() => navigate("/manage-proposals")}
            />

            <SidebarItem
              icon={<Calendar size={20} />}
              label="Eventet"
              active={activeView === "events"}
              onClick={() => navigate("/manage-events")}
            />

            <SidebarItem
              icon={<MessageSquare size={20} />}
              label="Takimet"
              active={activeView === "meetings"}
              onClick={() => navigate("/manage-meetings")}
            />

            <SidebarItem
              icon={<Hammer size={20} />}
              label="Lejet e Ndërtimit"
              active={activeView === "permits"}
              onClick={() => navigate("/manage-permits")}
            />

            <div className="mt-auto p-4 border-t">
              <LogoutButton showLabel={true} />
            </div>
          </nav>
        </div>

        {/* USER */}
        <div className="border-t border-slate-100 p-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#010694] text-white flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900">Admin</p>
            <p className="text-[10px] text-slate-500">Workspace</p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white/80 backdrop-blur">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* MOBILE MENU BUTTON */}
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>

            <div className="text-sm font-medium text-slate-500 capitalize">
              {activeView === "overview" ? "Dashboard Overview" : activeView}
            </div>
          </div>
        </header>

        {/* CONTENT - OUTLET WILL INJECT SUBPAGES HERE (AddKomuna, MenaxhoKomunat, Dashboard etc) */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// SideBar item generic component
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
