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
import { logout } from "../services/authService";
import { Navigate, useNavigate } from "react-router-dom";
import { currentUser } from "../services/authService";

function NotificationPanel({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}) {
  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">Njoftimet</span>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-medium"
            >
              <CheckCheck size={13} />
              Lexo të gjitha
            </button>
          )}

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-50">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <Bell size={28} className="mb-2 opacity-30" />
            <p className="text-sm">Nuk ka njoftime</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && onMarkAsRead(n.id)}
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                n.isRead
                  ? "bg-white hover:bg-gray-50"
                  : "bg-blue-50 hover:bg-blue-100"
              }`}
            >
              <span
                className={`block w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  !n.isRead ? "bg-blue-500" : "bg-transparent"
                }`}
              />

              <div className="flex-1 min-w-0">
                <p
                  className={`text-[13px] leading-snug ${
                    n.isRead ? "text-gray-500" : "text-gray-800 font-medium"
                  }`}
                >
                  {n.message}
                </p>

                <p className="text-[10px] text-gray-400 mt-1">
                  {n.createdAt
                    ? new Date(n.createdAt).toLocaleString("sq-AL", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </p>
              </div>
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const testUser = async () => {
      try {
        const user = await currentUser();

        console.log(user);
      } catch (err) {
        console.error(err);
      }
    };

    testUser();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await departmentService.getAll();
        setDeptCount(res.data.length);
      } catch (err) {
        console.error("Gabim gjate marrjes se statistikave", err);
      }
    };

    fetchStats();

    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Citizen Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Mirë se vini, këtu mund të menaxhoni shërbimet tuaja.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={panelRef}>
            <button
              onClick={() => setPanelOpen((prev) => !prev)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell size={22} className="text-gray-600" />

              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
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
            className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition"
          >
            Çkyçu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Drejtoritë"
          value={deptCount}
          icon={<Building2 size={18} />}
        />

        <StatCard
          label="Kërkesat e mia"
          value="3"
          icon={<FileText size={18} />}
        />

        <StatCard label="Në pritje" value="1" icon={<Clock size={18} />} />

        <StatCard
          label="Të përfunduara"
          value="2"
          icon={<CheckCircle size={18} />}
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setShowDepartments(!showDepartments)}
          className="flex items-center gap-2 bg-[#010694] text-white px-5 py-3 rounded-xl shadow hover:bg-[#0208c7] transition-all"
        >
          <Building2 size={18} />
          {showDepartments ? "Fshih Drejtoritë" : "Shiko Drejtoritë"}
        </button>

        <button
          onClick={() => setShowEvents(!showEvents)}
          className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl shadow hover:bg-purple-700 transition-all"
        >
          <Calendar size={18} />
          {showEvents ? "Fshih Eventet" : "Shiko Eventet"}
        </button>
      </div>

      {showDepartments && (
        <div className="mt-6">
          <ShikoDepartments />
        </div>
      )}

      {showEvents && (
        <div className="mt-6">
          <EventList />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <h3 className="text-2xl font-semibold text-slate-900 mt-2">{value}</h3>
      </div>

      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#eff0ff] text-[#010694]">
        {icon}
      </div>
    </div>
  );
}
