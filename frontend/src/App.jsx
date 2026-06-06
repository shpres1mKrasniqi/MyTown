import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

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

// Auth pages (publike)
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));

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

        {/* ── Admin only ── */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/AddDepartment"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AddDepartment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-department/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <EditDepartment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/MenaxhoDepartments"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <MenaxhoDepartments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ShikoDepartments"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <ShikoDepartments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AddKomuna"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AddKomuna />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-komuna/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <EditKomuna />
            </ProtectedRoute>
          }
        />
        <Route
          path="/MenaxhoKomunat"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <MenaxhoKomunat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-staff"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <MenaxhoStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-staff"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AddStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-staff/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <EditStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-issueCategory"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AddIssueCategory />
            </ProtectedRoute>
          }
        />

        {/* ── Admin + Staff ── */}
        <Route
          path="/manage-issues"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
              <MenaxhoIssues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-proposals"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
              <MenaxhoProposals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-events"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
              <MenaxhoEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-meetings"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
              <MenaxhoMeetings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-permits"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
              <MenaxhoPermits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
              <EditIssueDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues/:id/status"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
              <UpdateIssueStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advanced-meeting-requests"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
              <MeetingRequestsSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-event"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
              <AddEvent />
            </ProtectedRoute>
          }
        />

        {/* ── Staff dashboard ── */}
        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Staff"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        {/* ── Citizen only ── */}
        <Route
          path="/citizen-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-issue"
          element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <AddIssue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-meeting-request"
          element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <AddMeetingRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-projectProposal"
          element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <AddProjectProposal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-construction-permit-request"
          element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <AddConstructionPermitRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-proposals/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <EditProjectProposal />
            </ProtectedRoute>
          }
        />

        {/* ── Citizen + të gjithë të kyçurit ── */}
        <Route
          path="/issues"
          element={
            <ProtectedRoute allowedRoles={["Citizen", "Admin", "Staff"]}>
              <IssueList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute allowedRoles={["Citizen", "Admin", "Staff"]}>
              <EventList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meeting-requests"
          element={
            <ProtectedRoute allowedRoles={["Citizen", "Admin", "Staff"]}>
              <MeetingsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lista-propozimeve"
          element={
            <ProtectedRoute allowedRoles={["Citizen", "Admin", "Staff"]}>
              <ProposalsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/construction-permits"
          element={
            <ProtectedRoute allowedRoles={["Citizen", "Admin", "Staff"]}>
              <ConstructionPermitsList />
            </ProtectedRoute>
          }
        />
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
