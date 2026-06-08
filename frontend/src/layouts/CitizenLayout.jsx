import CitizenSidebar from "../components/citizen/CitizenSidebar";
import { Outlet } from "react-router-dom";

export default function CitizenLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <CitizenSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
