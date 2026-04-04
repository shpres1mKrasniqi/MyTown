import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import AdminLayout from "./layouts/AdminLayout";

const Login = lazy(() => import("./components/Login"));
const AdminDashboard = lazy(() => import("./dashboards/adminDashboard"));
const StaffDashboard = lazy(() => import("./dashboards/staffDashboard"));
const CitizenDashboard = lazy(() => import("./dashboards/citizenDashboard"));
const AddDepartment = lazy(() => import("./pages/AddDepartment"));
const EditDepartment = lazy(() => import("./pages/EditDepartment"));
const MenaxhoDepartments = lazy(() => import("./pages/MenaxhoDepartments"));
const ShikoDepartments = lazy(() => import("./pages/ShikoDepartments"));
const AddKomuna = lazy(() => import("./pages/AddKomuna"));
const EditKomuna = lazy(() => import("./pages/EditKomuna"));
const MenaxhoKomunat = lazy(() => import("./pages/MenaxhoKomunat"));
const MenaxhoStaff = lazy(() => import("./pages/MenaxhoStaff"));
const AddStaff = lazy(() => import("./pages/AddStaff"));
const EditStaff = lazy(() => import("./pages/EditStaff"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* ADMIN LAYOUT ROUTE WRAPPER */}
        <Route element={<AdminLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/AddDepartment" element={<AddDepartment />} />
          <Route path="/edit-department/:id" element={<EditDepartment />} />
          <Route path="/MenaxhoDepartments" element={<MenaxhoDepartments />} />
          <Route path="/ShikoDepartments" element={<ShikoDepartments />} />
          <Route path="/AddKomuna" element={<AddKomuna />} />
          <Route path="/edit-komuna/:id" element={<EditKomuna />} />
          <Route path="/MenaxhoKomunat" element={<MenaxhoKomunat />} />
          <Route path="/edit-staff/:id" element={<EditStaff />} />
          <Route path="/manage-staff" element={<MenaxhoStaff />} />
          <Route path="/add-staff" element={<AddStaff />} />
        </Route>

        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        limit={1}
        theme="colored"
      />
    </Suspense>
  );
}

export default App;
