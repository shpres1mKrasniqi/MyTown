import { useState, useRef, useEffect } from "react";
import { 
  Bell, Calendar, Plus, List, LayoutDashboard, Settings, LogOut, 
  ShoppingBag, MapPin, AlertTriangle, MessageSquare, HandHelping, Trash2, AlertCircle, Clock, CheckCircle2, XCircle
} from "lucide-react";
import { useNotifications } from "../pages/Usenotification";
import { eventService } from "../services/eventService"; 
import { IssueService as issueService } from "../services/IssueServices";
import { ProposalService as proposalService } from "../services/proposalService";
import { meetingService } from "../services/meetingService";
import { currentUser } from "../services/authService";
import { toast } from "react-toastify";

import AddEvent from "../pages/AddEvent";
import EventList from "../pages/EventList";
import HistoryPage from "../pages/HistoryPage";
import MenaxhoProposals from "../pages/MenaxhoProposals";
import MenaxhoEvents from "../pages/MenaxhoEvents";
import MenaxhoMeetings from "../pages/MenaxhoMeetings";
import MenaxhoPermits from "../pages/MenaxhoPermits";

// --- ISSUES PAGE ---
function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    issueService.getAll()
      .then(res => setIssues(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-sm text-gray-500">Duke ngarkuar ankesat...</div>;

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


// --- MEETING REQUESTS LIST (Komponenti juaj i rregulluar dhe i zbukuruar) ---
function MeetingRequestsList() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'pending', 'approved', 'rejected'
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isCitizen = user?.roles?.includes("Citizen");
  const isStaff = user?.roles?.includes("Staff");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await meetingService.getAll();
      setRequests(res.data || []);
      setFilteredRequests(res.data || []);
    } catch (err) {
      setError("Gabim gjatë marrjes së të dhënave");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const data = await currentUser();
      setUser(data);
    } catch (err) {
      console.log("Gabim gjatë marrjes së userit aktual", err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchCurrentUser();
  }, []);

  // Filtruesi i Tab-eve në kohë reale
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredRequests(requests);
    } else if (activeTab === "pending") {
      setFilteredRequests(requests.filter(r => r.status === 0));
    } else if (activeTab === "approved") {
      setFilteredRequests(requests.filter(r => r.status === 1));
    } else if (activeTab === "rejected") {
      setFilteredRequests(requests.filter(r => r.status === 2));
    }
  }, [activeTab, requests]);

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni i sigurt që doni ta fshini?")) return;
    try {
      await meetingService.deleteSoft(id);
      toast.success("U fshi me sukses");
      fetchRequests();
    } catch (err) {
      toast.error("Gabim gjatë fshirjes");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await meetingService.updateStatus(id, {
        status: Number(newStatus),
      });
      toast.success("Statusi u përditësua");
      fetchRequests();
    } catch (err) {
      toast.error("Gabim gjatë përditësimit");
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 0: return "bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500/20";
      case 1: return "bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500/20";
      case 2: return "bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-500/20";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0: return "Në pritje";
      case 1: return "Pranuar";
      case 2: return "Refuzuar";
      default: return "E panjohur";
    }
  };

  if (loading) return <div className="text-center py-12 text-sm text-gray-500">Duke ngarkuar kërkesat për takim...</div>;

  return (
    <div className="space-y-6">
      {/* Top Header i brendshëm */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Kërkesat për Takime Zyrtare</h2>
        <p className="text-xs text-gray-500 mt-0.5">Menaxhimi i takimeve dhe orareve mes stafit të komunës dhe qytetarëve.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 p-4 rounded-xl border border-red-100 shadow-xs">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* TABS FILTRUESE (Stili modern nga imazhi juaj) */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-100 max-w-md shadow-xs">
        {[
          { id: "all", label: "Të gjitha" },
          { id: "pending", label: "Në pritje" },
          { id: "approved", label: "Pranuar" },
          { id: "rejected", label: "Refuzuar" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === tab.id 
                ? "bg-[#202d60] text-white shadow-xs" 
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABELA */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="p-4 pl-6">Titulli</th>
                <th className="p-4">Arsyeja / Detajet</th>
                <th className="p-4">Data dhe Ora</th>
                <th className="p-4">Statusi</th>
                {isCitizen && <th className="p-4 pr-6 text-right">Veprime</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 text-gray-700">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400 font-medium">
                    Nuk ka asnjë kërkesë të regjistruar në këtë kategori.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-4 pl-6 font-bold text-gray-900 max-w-[180px] truncate">
                      {req.title}
                    </td>

                    <td className="p-4 text-gray-500 max-w-[260px] truncate">
                      {req.reason}
                    </td>

                    <td className="p-4 whitespace-nowrap text-gray-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        <span>{new Date(req.dateOfMeeting).toLocaleString("sq-AL", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {/* Kontrolli i Statusit (Nëse jeni staf shfaqet selektori, përndryshe tekst) */}
                      {isStaff || true ? ( 
                        <select
                          value={req.status}
                          onChange={(e) => handleStatusChange(req.id, e.target.value)}
                          className={`text-[11px] font-bold uppercase tracking-wide border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 transition-all bg-white cursor-pointer ${getStatusStyles(req.status)}`}
                        >
                          <option value={0}>⏳ Në pritje</option>
                          <option value={1}>✅ Pranuar</option>
                          <option value={2}>❌ Refuzuar</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${getStatusStyles(req.status)}`}>
                          {getStatusText(req.status)}
                        </span>
                      )}
                    </td>

                    {isCitizen && (
                      <td className="p-4 pr-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- PROPOSALS PAGE ---
function ProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    proposalService.getAll()
      .then(res => setProposals(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-sm text-gray-500">Duke ngarkuar propozimet...</div>;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
        <h3 className="font-bold text-gray-800 text-sm">Lista e Propozimeve</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">Idetë dhe propozimet e dërguara nga komuniteti.</p>
      </div>
      {proposals.length === 0 ? (
        <div className="p-8 text-center text-gray-400 text-xs">Nuk ka propozime të regjistruara.</div>
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
            {proposals.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{p.title}</td>
                <td className="px-6 py-4 text-gray-500">{p.description || "—"}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-100">
                    {p.status || "Aktive"}
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

// --- VARIABLAT E REJA TË MENUSË (Tani kemi një link të vetëm kompakt për Takimet) ---
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

        {/* STATISTIKAT KARTAT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div onClick={() => setActivePage("event-list")} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all">
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Evente Gjithsej</p>
              <p className="text-2xl font-black text-gray-800 mt-1">{dbEvents.length}</p>
            </div>
            <div className="p-3 bg-blue-50 text-[#202d60] rounded-xl border border-blue-100">
              <ShoppingBag size={18} />
            </div>
          </div>

          <div onClick={() => setActivePage("issues")} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all">
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Issues (Ankesa)</p>
              <p className="text-2xl font-black text-red-600 mt-1">{stats.issuesCount}</p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
              <AlertTriangle size={18} />
            </div>
          </div>

          <div onClick={() => setActivePage("meeting-requests")} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all">
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Kërkesa për Takim</p>
              <p className="text-2xl font-black text-amber-500 mt-1">{stats.meetingsCount}</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl border border-amber-100">
              <MessageSquare size={18} />
            </div>
          </div>

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

  // --- RENDERING DINAMIKE E PËRMABAJTJES ---
  const renderContent = () => {
    switch (activePage) {
      case "dashboard":        return renderDashboardHome();
      case "add-event":        return <AddEvent onBack={() => setActivePage("dashboard")} />;
      case "event-list":       return <MenaxhoEvents isReadonly={true} />;
      case "issues":           return <IssuesPage />;
      case "meeting-requests": return <MenaxhoMeetings isReadonly={true} />;
      case "proposals":        return <MenaxhoProposals isReadonly={true} />;
      case "construction-permits": return <MenaxhoPermits isReadonly={true} />;
      case "meeting-requests": return <MeetingRequestsList />; // Këtu thirret direkt faqja juaj e re!
      case "proposals":        return <ProposalsPage />;
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
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 relative">
          <h1 className="text-sm font-bold text-gray-800 capitalize">
            {MENU.find((m) => m.key === activePage)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            
            <div className="relative" ref={panelRef}>
              <button 
                onClick={() => setPanelOpen((prev) => !prev)} 
                className={`relative p-2 rounded-xl border transition-colors ${
                  panelOpen ? "bg-gray-100 text-[#202d60] border-gray-200" : "bg-gray-50 hover:bg-gray-100 border-gray-100 text-gray-600"
                }`}
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {panelOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden transform origin-top-right transition-all">
                  <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">Njoftimet ({unreadCount})</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => { markAllAsRead(); setPanelOpen(false); }} 
                        className="text-[10px] text-[#202d60] font-bold hover:underline"
                      >
                        Lexo të gjitha
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                    {notifications && notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-xs font-medium">
                        Nuk ka njoftime të reja.
                      </div>
                    ) : (
                      notifications?.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => { markAsRead(notif.id); setPanelOpen(false); }}
                          className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-50/80 ${
                            !notif.isRead ? "bg-blue-50/40 font-medium" : ""
                          }`}
                        >
                          <p className="text-xs text-gray-800">{notif.message || "Njoftim i ri"}</p>
                          <span className="text-[9px] text-gray-400 block mt-1">
                            {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString("sq-AL", { hour: '2-digit', minute: '2-digit' }) : "Tani"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="w-8 h-8 rounded-xl bg-[#202d60] text-white flex items-center justify-center text-xs font-black shadow-sm">
              ST
            </div>
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