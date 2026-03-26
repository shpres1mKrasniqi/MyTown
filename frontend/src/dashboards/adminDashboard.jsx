
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Settings
} from "lucide-react";

import MenaxhoDepartments from "../pages/MenaxhoDepartments";
import { departmentService } from "../services/departmentService";

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("overview");
  const [deptCount, setDeptCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
   const fetchStats = async () => {
        try{
            const res = await departmentService.getAll();
            setDeptCount(res.data.length);
        }catch(err){
            toast.error("Gabim gjate marrjes se statistikave", err);
        }
    };
    fetchStats();
  },[]);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-slate-800">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between">
       
        {/* LOGO */}
        <div>
          <div className="flex h-16 items-center px-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-[#010694] text-white flex items-center justify-center rounded">
                ∞
              </div>
              <span className="text-lg font-extrabold text-slate-900">
                MYTOWN
              </span>
            </div>
          </div>

          {/* NAV */}
          <nav className="space-y-1 px-3 py-6">
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              active={activeView === "overview"}
              onClick={() => setActiveView("overview")}
            />

            <SidebarItem
              icon={<Building2 size={20} />}
              label="Drejtoritë"
              active={activeView === "manage"}
              onClick={() => setActiveView("manage")}
            />

            <SidebarItem
              icon={<PlusCircle size={20} />}
              label="Shto Departament"
              onClick={() => navigate("/AddDepartment")}
            />

            <SidebarItem
              icon={<Settings size={20} />}
              label="Settings"
              active={activeView === "settings"}
              onClick={() => setActiveView("settings")}
            />
          </nav>
        </div>

        {/* USER */}
        <div className="border-t border-slate-100 p-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#010694] text-white flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900">
              Admin
            </p>
            <p className="text-[10px] text-slate-500">Workspace</p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white/80 backdrop-blur">
         
          <div className="text-sm font-medium text-slate-500 capitalize">
            {activeView}
          </div>

          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">

          {/* OVERVIEW */}
          {activeView === "overview" && (
            <>
              <div className="mb-8 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">
                    Overview
                  </h1>
                  <p className="text-sm text-slate-500">
                    Welcome back, ja çfarë po ndodh sot.
                  </p>
                </div>

                <button className="bg-[#010694] hover:bg-[#2220aa] text-white px-4 py-2 rounded-lg text-sm">
                  Export
                </button>
              </div>

           {/* STATS - Tani përdorim vlerën nga databaza */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Drejtoritë" value={deptCount} /> {/* Vlera nga databaza */}
                <StatCard label="Përdoruesit" value="1.2k" />
                <StatCard label="Kërkesat" value="48" />
                <StatCard label="Aktive" value="95%" />
              </div>
            </>
          )}

          {activeView === "manage" && <MenaxhoDepartments />}

          {activeView === "settings" && (
            <div className="p-10 border border-dashed rounded-xl text-center">
              Settings coming soon...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* COMPONENTS */

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-[#eff0ff] text-[#010694]"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <h3 className="text-2xl font-semibold text-slate-900 mt-2">
        {value}
      </h3>
    </div>
  );
}