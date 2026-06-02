import { useEffect, useState } from "react";
import { meetingService } from "../services/meetingService";
import { Trash2, Calendar, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { currentUser } from "../services/authService";
import DataExchangeToolbar from "../components/DataExchangeToolbar";

function MeetingRequestsList() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const isCitizen = user?.roles?.includes("Citizen");
  const isStaff = user?.roles?.includes("Staff");

  const fetchRequests = async () => {
    try {
      const res = await meetingService.getAll();
      setRequests(res.data);
    } catch (err) {
      setError("Gabim gjatë marrjes së të dhënave");
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const data = await currentUser();
      setUser(data);
    } catch (err) {
      console.log("Gabim gjatë marrjes së userit aktual", err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchCurrentUser();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni i sigurt që doni ta fshini?")) return;

    try {
      await meetingService.deleteSoft(id);
      toast.success("U fshi me sukses");
      fetchRequests();
    } catch (err) {
      toast.error("Gabim gjatë fshirjes");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await meetingService.updateStatus(id, {
        status: Number(newStatus),
      });

      toast.success("Statusi u përditësua");
      fetchRequests();
    } catch (err) {
      toast.error("Gabim gjatë përditësimit");
    }
  };

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
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Kërkesat për Takim
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Menaxhoni dhe shikoni statusin e të gjitha kërkesave për takim.
          </p>
        </div>
        <DataExchangeToolbar entityType="meetings" onImportSuccess={fetchRequests} />
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-sm text-red-500 bg-red-50 p-4 rounded-lg border border-red-100">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="p-4 pl-6 font-medium">Titulli</th>
                <th className="p-4 font-medium">Arsyeja</th>
                <th className="p-4 font-medium">Data</th>
                <th className="p-4 font-medium">Statusi</th>
                {isCitizen && (
                  <th className="p-4 pr-6 font-medium text-right">Veprime</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-12 text-slate-400 text-sm"
                  >
                    Nuk ka kërkesa të regjistruara aktualisht.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="p-4 pl-6 font-medium text-slate-900 max-w-[200px] truncate">
                      {req.title}
                    </td>

                    <td className="p-4 text-slate-600 max-w-[300px] truncate">
                      {req.reason}
                    </td>

                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        <span>
                          {new Date(req.dateOfMeeting).toLocaleString()}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {isStaff ? (
                        <select
                          value={req.status}
                          onChange={(e) =>
                            handleStatusChange(req.id, e.target.value)
                          }
                          className={`text-xs font-medium border rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400/20 transition-colors bg-white ${getStatusStyles(req.status)}`}
                        >
                          <option value={0}>Në pritje</option>
                          <option value={1}>Pranuar</option>
                          <option value={2}>Refuzuar</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusStyles(req.status)}`}
                        >
                          {getStatusText(req.status)}
                        </span>
                      )}
                    </td>

                    {isCitizen && (
                      <td className="p-4 pr-6 text-right whitespace-nowrap">
                        <div className="flex justify-end items-center h-full min-h-[28px]">
                          {isCitizen && (
                            <button
                              onClick={() => handleDelete(req.id)}
                              className="p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MeetingRequestsList;
