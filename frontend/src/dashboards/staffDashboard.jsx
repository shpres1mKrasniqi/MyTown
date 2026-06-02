import { useState, useRef, useEffect } from "react";
import { 
  Bell, Calendar, Plus, List, LayoutDashboard, Settings, LogOut, 
  ShoppingBag, MapPin, AlertTriangle, MessageSquare, HandHelping 
} from "lucide-react";
import { useNotifications } from "../pages/Usenotification";
import { eventService } from "../services/eventService"; 
import { IssueService as issueService } from "../services/IssueServices";
import { ProposalService as proposalService } from "../services/proposalService";
import { meetingService } from "../services/meetingService";

import AddEvent from "../pages/AddEvent";
import EventList from "../pages/EventList";
import HistoryPage from "../pages/HistoryPage";
import MenaxhoProposals from "../pages/MenaxhoProposals";
import MenaxhoEvents from "../pages/MenaxhoEvents";
import MenaxhoMeetings from "../pages/MenaxhoMeetings";
import MenaxhoPermits from "../pages/MenaxhoPermits";


 function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    issueService.getAll()
      .then(res => setIssues(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-sm text-gray-500">Duke ngarkuar...</div>;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
        <h3 className="font-bold text-gray-800 text-sm">Lista e Ankesave / Issues</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">Problemet e raportuara nga qytetarët.</p>
      </div>
      {issues.length === 0 ? (
        <div className="p-8 text-center text-gray-400 text-xs">Nuk ka ankesa të regjistruara.</div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
              <th className="px-6 py-3.5">Titulli</th>
              <th className="px-6 py-3.5">Përshkrimi</th>
              <th className="px-6 py-3.5">Statusi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
            {issues.map((issue) => (
              <tr key={issue.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{issue.title}</td>
                <td className="px-6 py-4 text-gray-500">{issue.description || "—"}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-red-50 text-red-700 border border-red-100">
                    {issue.status || "Aktive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}



const MENU = [
  { key: "dashboard",        label: "Dashboard",          icon: LayoutDashboard },
  { key: "add-event",        label: "Krijo Event",        icon: Plus },
  { key: "event-list",       label: "Eventet",            icon: List },
  { key: "issues",           label: "Issues (Ankesat)",   icon: AlertTriangle },
  { key: "meeting-requests", label: "Kërkesat për Takim", icon: MessageSquare },
  { key: "proposals",        label: "Propozimet",         icon: HandHelping },
  { key: "construction-permits", label: "Leje Ndërtimi", icon: List },
  { key: "history",          label: "Historiku",          icon: Calendar }
];

export default function StaffDashboard() {
  const [panelOpen, setPanelOpen]   = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const panelRef = useRef(null);


  const [dbEvents, setDbEvents] = useState([]);
  const [stats, setStats] = useState({ issuesCount: 0, meetingsCount: 0, proposalsCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // --- FETCHING ALL DATA ---
  const fetchDashboardData = async () => {
  try {
    setLoading(true);
 const [resEvents, resIssues, resMeetings, resProposals] = await Promise.all([
  eventService.getAll(),
  issueService.getAll(),
  meetingService.getAll(),
  proposalService.getAll(),
]);

    setDbEvents(resEvents.data || []);
    setStats({
      issuesCount:   (resIssues.data || []).length,
      meetingsCount: (resMeetings.data || []).length,
      proposalsCount:(resProposals.data || []).length,
    });
  } catch (err) {
    console.error("Gabim gjatë ngarkimit të të dhënave:", err);
    setError("Dështoi ngarkimi i të dhënave nga databaza.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (activePage === "dashboard") {
      fetchDashboardData();
    }
  }, [activePage]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderDashboardHome = () => {
    if (loading) return <div className="text-center py-12 text-sm text-gray-500 font-medium">Duke komunikuar me databazën...</div>;
    if (error) return <div className="text-center py-12 text-sm text-red-500 font-medium">⚠️ {error}</div>;

    const recentEvents = [...dbEvents].reverse().slice(0, 5);

    return (
      <div className="space-y-6">
        {/* Top Welcome Bar */}
        <div className="bg-[#202d60] text-white p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-lg font-bold">Mirëseerdhët në Staff Panel</h2>
            <p className="text-xs text-white/70 mt-0.5">Pasqyra e përgjithshme e eventeve, ankesave dhe kërkesave të qytetarëve.</p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-white/10 px-3 py-2 rounded-xl border border-white/10 backdrop-blur-sm font-medium">
            <Calendar size={14} />
            <span>Sot: {new Date().toLocaleDateString("sq-AL", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {/* GRID I RAMPARTIT TË RI TË STATISTIKAVE (4 Karta për të gjitha modulet) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Karta 1 - Eventet */}
          <div onClick={() => setActivePage("event-list")} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all">
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Evente Gjithsej</p>
              <p className="text-2xl font-black text-gray-800 mt-1">{dbEvents.length}</p>
            </div>
            <div className="p-3 bg-blue-50 text-[#202d60] rounded-xl border border-blue-100">
              <ShoppingBag size={18} />
            </div>
          </div>

          {/* Karta 2 - Issues */}
          <div onClick={() => setActivePage("issues")} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all">
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Issues (Ankesa)</p>
              <p className="text-2xl font-black text-red-600 mt-1">{stats.issuesCount}</p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
              <AlertTriangle size={18} />
            </div>
          </div>

          {/* Karta 3 - Meeting Requests */}
          <div onClick={() => setActivePage("meeting-requests")} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all">
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Kërkesa për Takim</p>
              <p className="text-2xl font-black text-amber-500 mt-1">{stats.meetingsCount}</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl border border-amber-100">
              <MessageSquare size={18} />
            </div>
          </div>

          {/* Karta 4 - Propozimet */}
          <div onClick={() => setActivePage("proposals")} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all">
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Propozime</p>
              <p className="text-2xl font-black text-purple-600 mt-1">{stats.proposalsCount}</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
              <HandHelping size={18} />
            </div>
          </div>
        </div>

        {/* Tabela e Eventeve të Fundit */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Eventet e Fundit në Databazë</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Aktivitetet e fundit të regjistruara.</p>
            </div>
            <button onClick={() => setActivePage("event-list")} className="text-xs font-bold text-[#202d60] hover:underline bg-white border px-3 py-1.5 rounded-xl shadow-xs">
              Shiko të gjitha
            </button>
          </div>
          
          <div className="overflow-x-auto">
            {recentEvents.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs font-medium">Nuk ka asnjë event të regjistruar.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
                    <th className="px-6 py-3.5">Titulli i Eventit</th>
                    <th className="px-6 py-3.5">Lokacioni</th>
                    <th className="px-6 py-3.5">Data e Mbajtjes</th>
                    <th className="px-6 py-3.5">Statusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                  {recentEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{event.title}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium inline-flex items-center gap-1 mt-1.5">
                        <MapPin size={12} className="text-gray-400" />
                        {event.location || "Pa lokacion"}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {event.eventDate ? new Date(event.eventDate).toLocaleDateString("sq-AL", { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                          event.status === 1 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {event.status === 1 ? "I Publikuar" : "Draft"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":        return renderDashboardHome();
      case "add-event":        return <AddEvent onBack={() => setActivePage("dashboard")} />;
      case "event-list":       return <MenaxhoEvents isReadonly={true} />;
      case "issues":           return <IssuesPage />;
      case "meeting-requests": return <MenaxhoMeetings isReadonly={true} />;
      case "proposals":        return <MenaxhoProposals isReadonly={true} />;
      case "construction-permits": return <MenaxhoPermits isReadonly={true} />;
      case "history":          return <HistoryPage />;
      default:                 return renderDashboardHome();
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#202d60] text-gray-300 flex flex-col justify-between flex-shrink-0 hidden md:flex border-r border-gray-800">
        <div>
          <div className="px-6 py-6 border-b border-white/5">
            <h2 className="text-white font-black text-sm tracking-wider uppercase">STAFF PANEL v1.0</h2>
          </div>
          <nav className="px-4 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            {MENU.map(({ key, label, icon: Icon }) => {
              const isActive = activePage === key;
              return (
                <button
                  key={key}
                  onClick={() => setActivePage(key)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 ${
                    isActive ? "bg-white text-[#202d60] font-bold shadow-md" : "hover:bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span className="text-xs font-semibold">{label}</span>
                  </div>
                  {isActive && <span className="text-xs">›</span>}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-white/5 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <Settings size={16} />
            <span>Rregullimet</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-red-400 hover:text-red-350 hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut size={16} />
            <span>Dil</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h1 className="text-sm font-bold text-gray-800 capitalize">
            {MENU.find((m) => m.key === activePage)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative" ref={panelRef}>
              <button onClick={() => setPanelOpen((prev) => !prev)} className="relative p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-600 transition-colors">
                <Bell size={16} />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
              </button>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#202d60] text-white flex items-center justify-center text-xs font-black shadow-sm">ST</div>
          </div>
        </header>

        {/* Main Context */}
        <main className="flex-1 overflow-auto p-6 bg-slate-50/50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}