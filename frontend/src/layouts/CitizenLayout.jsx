import CitizenSidebar from "../components/citizen/CitizenSidebar";
import { Outlet } from "react-router-dom";

export default function CitizenLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <CitizenSidebar />

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
