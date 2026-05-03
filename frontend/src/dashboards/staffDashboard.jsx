import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, X, Plus, Calendar, List } from "lucide-react";
import { useNotifications } from "../pages/Usenotification";
import AddEvent from "../pages/AddEvent";
import EventList from "../pages/EventList";

function NotificationPanel({ notifications, unreadCount, onMarkAsRead, onMarkAllAsRead, onClose }) {
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
                n.isRead ? "bg-white hover:bg-gray-50" : "bg-blue-50 hover:bg-blue-100"
              }`}
            >
              <div className="mt-1 flex-shrink-0">
                <span className={`block w-2 h-2 rounded-full mt-1 ${!n.isRead ? "bg-blue-500" : "bg-transparent"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] leading-snug ${n.isRead ? "text-gray-500" : "text-gray-800 font-medium"}`}>
                  {n.message}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {n.createdAt
                    ? new Date(n.createdAt).toLocaleString("sq-AL", {
                        day: "numeric", month: "short",
                        hour: "2-digit", minute: "2-digit",
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

// ─── Sidebar items ────────────────────────────────────────
const MENU = [
  { key: "add-event",   label: "Krijo Event",   icon: Plus },
  { key: "event-list",  label: "Eventet",        icon: List },
];

export default function StaffDashboard() {
  const [panelOpen, setPanelOpen]   = useState(false);
  const [activePage, setActivePage] = useState(null);
  const panelRef = useRef(null);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderContent = () => {
    switch (activePage) {
      case "add-event":  return <AddEvent />;
      case "event-list": return <EventList />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center gap-6">
            <Calendar size={48} className="text-gray-300" />
            <div>
              <p className="text-gray-500 font-medium">Mirë se vini në Staff Dashboard</p>
              <p className="text-gray-400 text-sm mt-1">Zgjidh një seksion nga menuja</p>
            </div>
            {/* Quick action cards */}
            <div className="flex gap-4 mt-4">
              {MENU.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActivePage(key)}
                  className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-2xl px-8 py-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors">
                    <Icon size={22} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back button */}
          {activePage && (
            <button
              onClick={() => setActivePage(null)}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1"
            >
              ← Kthehu
            </button>
          )}
          <h1 className="text-base font-semibold text-gray-800">
            {activePage
              ? MENU.find((m) => m.key === activePage)?.label
              : "Staff Dashboard"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Nav buttons */}
          {MENU.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActivePage(key)}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
                activePage === key
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}

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
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}