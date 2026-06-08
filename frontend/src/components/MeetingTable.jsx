import MeetingTableRow from "./MeetingTableRow";
export default function MeetingTable({
  requests,
  handleDelete,
  user,
  handleStatusChange,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b text-xs uppercase">
            <tr>
              <th className="p-4">Titulli</th>
              <th className="p-4">Arsyeja</th>
              <th className="p-4">Data</th>
              <th className="p-4">Statusi</th>
              {user && user.isCitizen && (
                <th className="p-4 text-right">Veprime</th>
              )}
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-400">
                  Nuk ka kërkesa
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <MeetingTableRow
                  key={req.id}
                  req={req}
                  user={user}
                  handleDelete={handleDelete}
                  handleStatusChange={handleStatusChange}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
