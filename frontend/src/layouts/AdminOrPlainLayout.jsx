import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { currentUser } from "../services/authService";

export default function AdminOrPlainLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    currentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#202d60]" />
      </div>
    );
  }

  if (user?.roles?.includes("Admin")) {
    return <AdminLayout />;
  }

  return <Outlet />;
}
