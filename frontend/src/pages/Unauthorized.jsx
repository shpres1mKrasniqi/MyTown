import { useNavigate } from "react-router-dom";
import { ShieldOff } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md w-full mx-4">
        <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-100 mx-auto">
          <ShieldOff size={28} />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Qasje e ndaluar</h1>
        <p className="text-sm text-slate-500">
          Nuk keni leje të aksesoni këtë faqe.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Kthehu prapa
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm font-medium text-white bg-[#202d60] rounded-xl hover:bg-[#162045] transition-colors"
          >
            Kyçu përsëri
          </button>
        </div>
      </div>
    </div>
  );
}
