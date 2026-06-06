import { useRef, useState, useEffect } from "react";
import {
  Bell,
  CheckCheck,
  X,
  Building2,
  FileText,
  Clock,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { useCitizenNotifications } from "../pages/useCitizenNotifications";
import ShikoDepartments from "../pages/ShikoDepartments";
import EventList from "../pages/EventList";
import { departmentService } from "../services/departmentService";
import { logout, currentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function NotificationPanel({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}) {
  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow border border-slate-200 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <span className="text-sm font-semibold text-slate-900">
          Njoftimet ({unreadCount})
        </span>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Lexo të gjitha
            </button>
          )}

          <button onClick={onClose}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <p className="p-4 text-sm text-slate-500 text-center">
            Nuk ka njoftime
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && onMarkAsRead(n.id)}
              className={`px-4 py-3 text-sm cursor-pointer ${
                n.isRead ? "text-slate-500" : "bg-slate-50 font-medium"
              }`}
            >
              {n.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function CitizenDashboard() {
  const [deptCount, setDeptCount] = useState(0);
  const [showDepartments, setShowDepartments] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const panelRef = useRef(null);
  const navigate = useNavigate();

  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useCitizenNotifications();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await departmentService.getAll();
        setDeptCount(res.data.length);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="space-y-8">
      {/* HEADER - SAME STYLE AS ADMIN */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Overview</h1>
          <p className="text-sm text-slate-500">Mirë se vini në dashboard.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* NOTIFICATIONS */}
          <div className="relative" ref={panelRef}>
            <button
              onClick={() => setPanelOpen(!panelOpen)}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
            >
              <Bell size={18} />
            </button>

            {panelOpen && (
              <NotificationPanel
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onClose={() => setPanelOpen(false)}
              />
            )}
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
          >
            Çkyçu
          </button>
        </div>
      </div>

      {/* STATS - IDENTICAL TO ADMIN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Drejtoritë" value={deptCount} />
        <StatCard label="Kërkesat e mia" value="3" />
        <StatCard label="Në pritje" value="1" />
        <StatCard label="Të përfunduara" value="2" />
      </div>

      {/* ACTION BUTTONS - CLEAN ADMIN STYLE */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowDepartments(!showDepartments)}
          className="px-4 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
        >
          {showDepartments ? "Fshih Drejtoritë" : "Shiko Drejtoritë"}
        </button>

        <button
          onClick={() => setShowEvents(!showEvents)}
          className="px-4 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
        >
          {showEvents ? "Fshih Eventet" : "Shiko Eventet"}
        </button>
      </div>

      {/* CONTENT */}
      {showDepartments && <ShikoDepartments />}
      {showEvents && <EventList />}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <h3 className="text-2xl font-semibold text-slate-900 mt-2">{value}</h3>
    </div>
  );
}
