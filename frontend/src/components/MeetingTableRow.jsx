export default function MeetingTableRow({
  req,
  user,
  handleDelete,
  handleStatusChange,
}) {
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
        {user?.isStaff ? (
          <select
            value={req.status}
            onChange={(e) => handleStatusChange(req.id, e.target.value)}
            className="text-xs border rounded px-2 py-1"
          >
            <option value={0}>Në pritje</option>
            <option value={1}>Pranuar</option>
            <option value={2}>Refuzuar</option>
          </select>
        ) : (
          <span className="text-xs px-2 py-1 rounded border">{req.status}</span>
        )}
      </td>

      {user && user.isCitizen && (
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
