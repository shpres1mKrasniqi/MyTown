import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminOrPlainLayout from "./layouts/AdminOrPlainLayout";

const LandingPage = lazy(() => import("./components/LandingPage"));
const Login = lazy(() => import("./components/Login"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));

// Admin & Staff pages
const AdminDashboard = lazy(() => import("./dashboards/adminDashboard"));
const StaffDashboard = lazy(() => import("./dashboards/staffDashboard"));
const AddDepartment = lazy(() => import("./pages/AddDepartment"));
const EditDepartment = lazy(() => import("./pages/EditDepartment"));
const MenaxhoDepartments = lazy(() => import("./pages/MenaxhoDepartments"));
const MenaxhoStaff = lazy(() => import("./pages/MenaxhoStaff"));
const AddStaff = lazy(() => import("./pages/AddStaff"));
const EditStaff = lazy(() => import("./pages/EditStaff"));
const MenaxhoIssues = lazy(() => import("./pages/MenaxhoIssues"));
const MenaxhoProposals = lazy(() => import("./pages/MenaxhoProposals"));
const MenaxhoEvents = lazy(() => import("./pages/MenaxhoEvents"));
const MenaxhoMeetings = lazy(() => import("./pages/MenaxhoMeetings"));
const MenaxhoPermits = lazy(() => import("./pages/MenaxhoPermits"));
const MenaxhoKomunat = lazy(() => import("./pages/MenaxhoKomunat"));
const AddKomuna = lazy(() => import("./pages/AddKomuna"));
const EditKomuna = lazy(() => import("./pages/EditKomuna"));
const ShikoDepartments = lazy(() => import("./pages/ShikoDepartments"));
const AddIssueCategory = lazy(() => import("./pages/AddIssueCategory"));
const CreateCitizen = lazy(() => import("./pages/CreateCitizen"));
const EditIssueDetails = lazy(() => import("./pages/EditIssueDetails"));
const UpdateIssueStatus = lazy(() => import("./pages/UpdateIssueStatus"));
const MeetingRequestsSearch = lazy(
  () => import("./pages/MeetingRequestsSearch"),
);

// Citizen pages
const CitizenDashboard = lazy(() => import("./dashboards/citizenDashboard"));
const AddIssue = lazy(() => import("./pages/AddIssues"));
const IssueList = lazy(() => import("./pages/IssueList"));
const EventList = lazy(() => import("./pages/EventList"));
const AddEvent = lazy(() => import("./pages/AddEvent"));
const AddProjectProposal = lazy(() => import("./pages/AddProjectProposal"));
const ProposalsList = lazy(() => import("./pages/ProposalsList"));
const EditProjectProposal = lazy(() => import("./pages/EditProjectProposal"));
const AddMeetingRequest = lazy(() => import("./pages/AddMeetingRequest"));
const MeetingsList = lazy(() => import("./pages/MeetingRequestsList"));
const AddConstructionPermitRequest = lazy(
  () => import("./pages/AddConstructionPermitRequest"),
);
const ConstructionPermitsList = lazy(
  () => import("./pages/ConstructionPermitsList"),
);
const CitizenLayout = lazy(() => import("./layouts/CitizenLayout"));

// Auth pages (publike)
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const WorkScheduleForm = lazy(
  () => import("./components/workschedule/WorkScheduleForm"),
);
const ManageWorkSchedules = lazy(() => import("./pages/ManageWorkSchedules"));
const ViewWorkSchedules = lazy(() => import("./pages/ViewWorkSchedules"));
function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#202d60]" />
        </div>
      }
    >
      <Routes>
        {/* ── Publike ── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/create-citizen" element={<CreateCitizen />} />

        {/* ── Meetings accessible for ALL roles (or Citizen + Staff + Admin) ── */}
        <Route
          path="/manage-meetings"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Staff", "Citizen"]}>
              <MenaxhoMeetings />
            </ProtectedRoute>
          }
        />

        {/* ── Admin only ── */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/AddDepartment" element={<AddDepartment />} />
          <Route path="/edit-department/:id" element={<EditDepartment />} />
          <Route path="/MenaxhoDepartments" element={<MenaxhoDepartments />} />
          <Route path="/ShikoDepartments" element={<ShikoDepartments />} />
          <Route path="/AddKomuna" element={<AddKomuna />} />
          <Route path="/edit-komuna/:id" element={<EditKomuna />} />
          <Route path="/MenaxhoKomunat" element={<MenaxhoKomunat />} />
          <Route path="/manage-staff" element={<MenaxhoStaff />} />
          <Route path="/add-staff" element={<AddStaff />} />
          <Route path="/edit-staff/:id" element={<EditStaff />} />
          <Route path="/add-issueCategory" element={<AddIssueCategory />} />
          <Route
            path="/manage-workSchedules"
            element={<ManageWorkSchedules />}
          />
        </Route>

        {/* ── Admin + Staff ── */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
              <AdminOrPlainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/shiko-oraret" element={<ViewWorkSchedules />} />
          <Route path="/manage-issues" element={<MenaxhoIssues />} />
          <Route path="/manage-proposals" element={<MenaxhoProposals />} />
          <Route path="/manage-events" element={<MenaxhoEvents />} />
          <Route path="/manage-permits" element={<MenaxhoPermits />} />
          <Route path="/issues/:id/status" element={<UpdateIssueStatus />} />
          <Route
            path="/advanced-meeting-requests"
            element={<MeetingRequestsSearch />}
          />
          <Route path="/add-event" element={<AddEvent />} />
        </Route>

        {/* ── Staff dashboard ── */}
        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Staff"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meeting-requests"
          element={
            <ProtectedRoute allowedRoles={["Citizen", "Staff", "Admin"]}>
              <MeetingsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff-dashboard/lista-propozimeve"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
              <ProposalsList />
            </ProtectedRoute>
          }
        />

        {/* ── Citizen only ── */}
        <Route
          path="/citizen-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <CitizenLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CitizenDashboard />} />

          <Route path="add-issue" element={<AddIssue />} />
          <Route path="add-meeting-request" element={<AddMeetingRequest />} />

          <Route
            path="add-construction-permit-request"
            element={<AddConstructionPermitRequest />}
          />

          <Route path="issues/edit/:id" element={<EditIssueDetails />} />
          <Route path="issues" element={<IssueList />} />
          <Route path="events" element={<EventList />} />
          <Route path="meeting-requests" element={<MeetingsList />} />
          <Route path="lista-propozimeve" element={<ProposalsList />} />
          <Route
            path="construction-permits"
            element={<ConstructionPermitsList />}
          />
        </Route>
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={1}
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        hideProgressBar={false}
        theme="colored"
      />
    </Suspense>
  );
}

export default App;
