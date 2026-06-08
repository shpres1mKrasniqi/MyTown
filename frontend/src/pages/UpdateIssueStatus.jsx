import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IssueService } from "../services/IssueServices";
import { ArrowLeft, Save } from "lucide-react";

function UpdateIssueStatus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [status, setStatus] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIssue = async () => {
      try {
        const res = await IssueService.getById(id);
        setIssue(res.data);
        setStatus(res.data.status);
      } catch (err) {
        console.log(err.response?.data || err.message);
        alert("Gabim gjatë leximit të issue.");
      } finally {
        setLoading(false);
      }
    };

    loadIssue();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await IssueService.updateStatus(id, {
        status: Number(status),
      });

      navigate("/staff-dashboard");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Gabim gjatë përditësimit të statusit.");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Duke u ngarkuar...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Përditëso Statusin
          </h1>
          <p className="text-sm text-slate-500">
            Ndrysho vetëm statusin e issue.
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border rounded-xl hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
          Kthehu
        </button>
      </div>

      {issue && (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <h2 className="font-semibold text-slate-800">{issue.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{issue.description}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Statusi
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#010694]"
          >
            <option value={0}>Pending</option>
            <option value={1}>Working On It</option>
            <option value={2}>Resolved</option>
            <option value={3}>Rejected</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Anulo
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#010694] text-white px-8 py-3 rounded-xl shadow-lg hover:bg-[#0208c7]"
          >
            <Save size={18} />
            Ruaj Statusin
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateIssueStatus;
