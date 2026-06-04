import { MoreHorizontal } from "lucide-react";
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
      <div>
        <h2>{issue.komunaName}</h2>
        <p className="text-xs text-gray-500">{issue.categoryName}</p>
      </div>

      <div className="relative">
        <MoreHorizontal onClick={() => setOpen(!open)} />

        {open && (
          <div className="absolute right-0 bg-white border shadow-md">
            {isCitizen && (
              <button onClick={() => navigate(`/issues/${issue.id}/edit`)}>
                Edit
              </button>
            )}

            {isStaff && (
              <button onClick={() => navigate(`/issues/${issue.id}/status`)}>
                Status
              </button>
            )}

            {isCitizen && (
              <button onClick={() => onDelete(issue.id)}>Delete</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
