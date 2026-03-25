import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const Login = lazy(() => import("./components/Login"));
const AdminDashboard = lazy(() => import("./dashboards/adminDashboard"));
const StaffDashboard = lazy(() => import("./dashboards/staffDashboard"));
const CitizenDashboard = lazy(() => import("./dashboards/citizenDashboard"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
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
