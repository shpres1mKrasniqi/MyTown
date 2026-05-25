import { useState } from "react";
import { meetingService } from "../services/meetingService";
import { toast } from "react-toastify";
import { Calendar, FileText, Heading2, Loader2 } from "lucide-react";

function AddMeetingRequest() {
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const data = {
        title,
        reason,
        dateOfMeeting: meetingDate,
      };

      await meetingService.create(data);
      toast.success("Kërkesa u dërgua me sukses!");

      setTitle("");
      setReason("");
      setMeetingDate("");
    } catch (err) {
      console.log(err);
      setError(err.response?.data || "Gabim gjatë dërgimit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Kërkesë për takim
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Platsoni formularin më poshtë për të kërkuar një takim me kryetarin.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Titulli i Kërkesës
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Heading2 size={18} />
              </div>
              <input
                type="text"
                placeholder="Kërkesë për takim..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Arsyeja e Takimit
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none text-slate-400">
                <FileText size={18} />
              </div>
              <textarea
                placeholder="Tregoni shkurtimisht arsyen e takimit..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={4}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors resize-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Data e preferuar
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar size={18} />
              </div>
              <input
                type="datetime-local"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-sm disabled:opacity-75 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Duke u dërguar...
                </>
              ) : (
                "Dërgo kërkesën"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMeetingRequest;
