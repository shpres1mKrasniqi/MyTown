import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard,  PlusCircle, Settings, Building2, 
  LogOut, 
  ChevronRight 
} from "lucide-react";

import MenaxhoDepartments from "../pages/MenaxhoDepartments";


export default function AdminDashboard() {
    const [activeView, setActiveView] = useState("overview");
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove("accessToken");
        navigate("/login");
    };

    return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-slate-300">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#111114] border-r border-slate-800/50 flex flex-col shadow-2xl">
        <div className="p-8 text-center border-b border-slate-800/30">
          <h1 className="text-2xl font-black text-white italic tracking-tighter">
            MY<span className="text-blue-500">TOWN</span> <span className="text-[10px] uppercase not-italic text-slate-500 block">Admin Panel</span>
          </h1>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          <p className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] mb-4 ml-2">Main Menu</p>
          
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeView === "overview"} 
            onClick={() => setActiveView("overview")} 
          />
          
          <SidebarItem 
            icon={<Building2 size={20} />} 
            label="Menaxho Drejtoritë" 
            active={activeView === "manage"} 
            onClick={() => setActiveView("manage")} 
          />
          
          <SidebarItem 
            icon={<PlusCircle size={20} />} 
            label="Shto Departament" 
            active={false} 
            onClick={() => navigate("/AddDepartment")} 
          />

          <div className="pt-8">
            <p className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] mb-4 ml-2">Settings</p>
            <SidebarItem 
              icon={<Settings size={20} />} 
              label="Konfigurimet" 
              active={activeView === "settings"} 
              onClick={() => setActiveView("settings")} 
            />
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-[#111114]/50 backdrop-blur-md border-b border-slate-800/30 flex items-center justify-between px-12 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span className="text-blue-500 capitalize">{activeView}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black text-white">System Admin</p>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</p>
            </div>
            <div className="h-10 w-10 bg-blue-600 rounded-full border-2 border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center justify-center font-black text-white text-xs">
              AD
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* DINAMIC VIEWS */}
          {activeView === "overview" && (
            <div className="max-w-4xl">
              <h1 className="text-4xl font-black text-white italic uppercase mb-2">
                Mirësevini, <span className="text-blue-500">Admin!</span>
              </h1>
              <p className="text-slate-500 font-medium">Këtu mund të menaxhoni të gjitha drejtoritë dhe shërbimet e qytetit.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <StatCard label="Drejtoritë" value="12" color="blue" />
                <StatCard label="Përdoruesit" value="1.2k" color="indigo" />
                <StatCard label="Kërkesat" value="48" color="emerald" />
              </div>
            </div>
          )}

          {activeView === "manage" && <MenaxhoDepartments />}
         
          {activeView === "settings" && (
            <div className="p-12 border-2 border-dashed border-slate-800 rounded-[3rem] text-center">
              <p className="text-slate-600 font-bold italic text-xl">Moduli i konfigurimeve po vjen së shpejti...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* KOMPONENTËT NDIHMËS */

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 font-bold group ${
        active 
        ? "bg-blue-600 text-white shadow-xl shadow-blue-900/20" 
        : "text-slate-500 hover:bg-[#1c1c21] hover:text-slate-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`${active ? "text-white" : "text-blue-500 group-hover:scale-110 transition-transform"}`}>
          {icon}
        </span>
        <span className="text-sm tracking-tight">{label}</span>
      </div>
      {active && <div className="h-1.5 w-1.5 bg-white rounded-full"></div>}
    </button>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-[#111114] p-8 rounded-[2.5rem] border border-slate-800/50 shadow-xl">
      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">{label}</p>
      <p className={`text-4xl font-black italic text-white`}>{value}</p>
      <div className={`h-1 w-12 mt-4 bg-blue-500 rounded-full`}></div>
    </div>
  );
}

