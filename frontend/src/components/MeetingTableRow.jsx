import { Calendar, Trash2 } from "lucide-react";

export default function MeetingTableRow({
  req,
  isCitizen,
  isStaff,
  handleDelete,
  handleStatusChange,
}) {
  const getStatusStyles = (status) => {
    switch (status) {
      case 0:
        return "bg-amber-50 text-amber-700 border-amber-100";
      case 1:
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case 2:
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Në pritje";
      case 1:
        return "Pranuar";
      case 2:
        return "Refuzuar";
      default:
        return "Unknown";
    }
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="p-4 font-medium">{req.title}</td>

      <td className="p-4 text-gray-600">{req.reason}</td>

      <td className="p-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={14} />
          {new Date(req.dateOfMeeting).toLocaleString()}
        </div>
      </td>

      <td className="p-4">
        {isStaff ? (
          <select
            value={req.status}
            onChange={(e) => handleStatusChange(req.id, e.target.value)}
            className={`text-xs border rounded px-2 py-1 ${getStatusStyles(
              req.status,
            )}`}
          >
            <option value={0}>Në pritje</option>
            <option value={1}>Pranuar</option>
            <option value={2}>Refuzuar</option>
          </select>
        ) : (
          <span
            className={`text-xs px-2 py-1 rounded border ${getStatusStyles(
              req.status,
            )}`}
          >
            {getStatusText(req.status)}
          </span>
        )}
      </td>

      {isCitizen && (
        <td className="p-4 text-right">
          <button
            onClick={() => handleDelete(req.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </td>
      )}
    </tr>
  );
}
