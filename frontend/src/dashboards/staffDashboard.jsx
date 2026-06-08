import { useState, useRef, useEffect } from "react";
import MeetingRequestsSearch from "../pages/MeetingRequestsSearch";
import {
  Bell,
  Calendar,
  Plus,
  List,
  LayoutDashboard,
  Settings,
  LogOut,
  ShoppingBag,
  MapPin,
  AlertTriangle,
  MessageSquare,
  CheckSquare,
  HandHelping,
  HouseIcon,
} from "lucide-react";
import { useNotifications } from "../pages/Usenotification";
import { eventService } from "../services/eventService";
import { IssueService as issueService } from "../services/IssueServices";
import { ProposalService as proposalService } from "../services/proposalService";
import { meetingService } from "../services/meetingService";
import IssueList from "../pages/IssueList";
import ProposalsList from "../pages/ProposalsList";
import MeetingRequestsList from "../pages/MeetingRequestsList";
import { currentUser } from "../services/authService";
import StaffSidebar from "../components/staff/StaffSideBar";
import StaffDashboardHome from "../components/staff/StaffDashboardHome";
import StaffHeader from "../components/staff/StaffHeader";
import { toast } from "react-toastify";
import ViewWorkSchedules from "../pages/ViewWorkSchedules";
import AddEvent from "../pages/AddEvent";
import EventList from "../pages/EventList";
import HistoryPage from "../pages/HistoryPage";
import MenaxhoMeetings from "../pages/MenaxhoMeetings";
import ConstructionPermitsList from "../pages/ConstructionPermitsList";
import AddProjectProposal from "../pages/AddProjectProposal";
const MENU = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "add-event", label: "Krijo Event", icon: Plus },
  { key: "event-list", label: "Eventet", icon: List },
  { key: "issues", label: "Issues (Ankesat)", icon: AlertTriangle },
  { key: "manage-meetings", label: "Takimet", icon: MessageSquare },
  { key: "meeting-requests", label: "Kërkesat për Takim", icon: CheckSquare },
  { key: "proposals", label: "Propozimet", icon: HandHelping },
  { key: "add-project-proposal", label: "Shto Propozim", icon: Plus },
  { key: "construction-permits", label: "Lejet ndertimore", icon: HouseIcon },
  { key: "history", label: "Historiku", icon: Calendar },
];

export default function StaffDashboard() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const panelRef = useRef(null);
  const [showMeetingRequests, setShowMeetingRequests] = useState(false);

  const [dbEvents, setDbEvents] = useState([]);
  const [stats, setStats] = useState({
    issuesCount: 0,
    meetingsCount: 0,
    proposalsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [resEvents, resIssues, resMeetings, resProposals] =
        await Promise.all([
          eventService.getAll(),
          issueService.getAll(),
          meetingService.getAll(),
          proposalService.getAll(),
        ]);

      setDbEvents(resEvents.data || []);
      setStats({
        issuesCount: (resIssues.data || []).length,
        meetingsCount: (resMeetings.data || []).length,
        proposalsCount: (resProposals.data || []).length,
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

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <StaffDashboardHome
            loading={loading}
            error={error}
            dbEvents={dbEvents}
            stats={stats}
            setActivePage={setActivePage}
          />
        );
      case "add-event":
        return <AddEvent onBack={() => setActivePage("dashboard")} />;
      case "event-list":
        return <EventList />;
      case "issues":
        return <IssueList />;

      case "manage-meetings":
        return (
          <div className="animate-fadeIn">
            <MenaxhoMeetings />
          </div>
        );

      case "shiko-oraret":
        return <ViewWorkSchedules />;

      case "meeting-requests":
        return (
          <div className="space-y-6 animate-fadeIn">
            <MeetingRequestsSearch />
          </div>
        );

      case "proposals":
        return <ProposalsList />;

      case "add-project-proposal":
        return (
          <div className="animate-fadeIn">
            <AddProjectProposal />
          </div>
        );

      case "construction-permits":
        return <ConstructionPermitsList />;
      case "history":
        return <HistoryPage />;
      default:
        return (
          <StaffDashboardHome
            loading={loading}
            error={error}
            dbEvents={dbEvents}
            stats={stats}
            setActivePage={setActivePage}
          />
        );
    }
  };

  return (
    <div className="h-screen bg-[#f4f6fa] flex overflow-hidden">
      {/* Sidebar */}
      <StaffSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        showMeetingRequests={showMeetingRequests}
        setShowMeetingRequests={setShowMeetingRequests}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <StaffHeader
          activePage={activePage}
          menu={MENU}
          panelOpen={panelOpen}
          setPanelOpen={setPanelOpen}
          panelRef={panelRef}
          notifications={notifications}
          unreadCount={unreadCount}
          markAsRead={markAsRead}
          markAllAsRead={markAllAsRead}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 bg-slate-50/50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
