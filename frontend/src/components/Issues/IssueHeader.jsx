import { MoreHorizontal, MapPin } from "lucide-react";
import { useState } from "react";

export default function IssueHeader({
  issue,
  onDelete,
  isCitizen,
  isStaff,
  navigate,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-600 p-[1.5px]">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <span className="text-[10px] font-bold text-gray-600">
              {issue.citizenName?.substring(0, 2).toUpperCase() || "QY"}
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold leading-tight">
            {issue.citizenName || "Qytetar"}
          </h2>
          <div className="flex items-center gap-1 text-[11px] text-gray-500">
            <MapPin size={12} />
            <p>{issue.komunaName || "Komuna"}</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <button onClick={() => setOpen(!open)} className="p-1 hover:bg-gray-100 rounded-full">
          <MoreHorizontal size={20} className="text-gray-500" />
        </button>

        {open && (
          <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-100 shadow-lg rounded-md py-1 z-10">
            {isCitizen && (
              <button onClick={() => navigate(`/issues/${issue.id}/edit`)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Përditëso
              </button>
            )}

            {isStaff && (
              <button onClick={() => navigate(`/issues/${issue.id}/status`)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Statusi
              </button>
            )}

            {isCitizen && (
              <button onClick={() => { setOpen(false); onDelete(issue.id); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                Fshij
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
