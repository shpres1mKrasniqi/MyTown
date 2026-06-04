import { Bell } from "lucide-react";

export default function StaffHeader({
  activePage,
  menu,
  panelOpen,
  setPanelOpen,
  panelRef,
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,
}) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 relative">
      <h1 className="text-sm font-bold text-gray-800 capitalize">
        {menu.find((m) => m.key === activePage)?.label || "Dashboard"}
      </h1>

      <div className="flex items-center gap-4">
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setPanelOpen((prev) => !prev)}
            className="relative p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-600"
          >
            <Bell size={16} />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {panelOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">
                  Njoftimet ({unreadCount})
                </span>

                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      markAllAsRead();
                      setPanelOpen(false);
                    }}
                    className="text-[10px] text-[#202d60] font-bold hover:underline"
                  >
                    Lexo të gjitha
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                {notifications?.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-xs">
                    Nuk ka njoftime.
                  </div>
                ) : (
                  notifications?.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markAsRead(notif.id);
                        setPanelOpen(false);
                      }}
                      className={`p-3 cursor-pointer hover:bg-slate-50 ${
                        !notif.isRead ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <p className="text-xs text-gray-800">
                        {notif.message}
                      </p>

                      <span className="text-[9px] text-gray-400">
                        {notif.createdAt
                          ? new Date(notif.createdAt).toLocaleTimeString(
                              "sq-AL",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "Tani"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-8 h-8 rounded-xl bg-[#202d60] text-white flex items-center justify-center text-xs font-black">
          ST
        </div>
      </div>
    </header>
  );
}