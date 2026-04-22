import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, X, Dot } from "lucide-react";
import { useNotifications } from "../pages/Usenotification";

function NotificationPanel({ notifications, unreadCount, onMarkAsRead, onMarkAllAsRead, onClose }) {
  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
      {/* Header */}
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
              className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-medium transition-colors"
            >
              <CheckCheck size={13} />
              Lexo të gjitha
            </button>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* List */}
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
              {/* Unread dot */}
              <div className="mt-1 flex-shrink-0">
                {!n.isRead ? (
                  <span className="block w-2 h-2 rounded-full bg-blue-500 mt-1" />
                ) : (
                  <span className="block w-2 h-2 rounded-full bg-transparent mt-1" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-[13px] leading-snug ${n.isRead ? "text-gray-500" : "text-gray-800 font-medium"}`}>
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

export default function StaffDashboard() {
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);

  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();

 
  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-800">Staff Dashboard</h1>

        {/* Bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setPanelOpen((prev) => !prev)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Bell size={20} className="text-gray-600" />
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
      </header>

      {/* Content */}
      <main className="flex items-center justify-center h-[calc(100vh-57px)]">
        <p className="text-gray-400 text-sm">Zgjidh një seksion nga menuja</p>
      </main>
    </div>
  );
}
