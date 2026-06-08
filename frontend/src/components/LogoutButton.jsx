import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { LogOut } from "lucide-react";

export default function LogoutButton({ className = "", showLabel = true }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors ${className}`}
    >
      <LogOut size={18} />
      {showLabel && <span className="text-sm font-medium">Çkyçu</span>}
    </button>
  );
}
