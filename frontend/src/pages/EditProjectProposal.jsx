import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProposalService } from "../services/proposalService";
import {
  Save,
  ArrowLeft,
  FileEdit,
  DollarSign,
  Calendar,
  Building,
} from "lucide-react";

function EditProjectProposal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    title: "",
    description: "",
    budget: "",
    plannedStartDate: "",
    plannedEndDate: "",
    tenderWinnerCompany: "",
    votingDeadline: "",
    komunaId: "",
  });

  const [currentFiles, setCurrentFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [deletedFileIds, setDeletedFileIds] = useState([]);

  useEffect(() => {
    const loadProposal = async () => {
      try {
        const response = await ProposalService.getById(id);
        const proposal = response.data;

        setData({
          title: proposal.title ?? "",
          description: proposal.description ?? "",
          budget: proposal.budget ?? "",
          plannedStartDate: proposal.plannedStartDate?.split("T")[0] || "",
          plannedEndDate: proposal.plannedEndDate?.split("T")[0] || "",
          tenderWinnerCompany: proposal.tenderWinnerCompany ?? "",
          votingDeadline: proposal.votingDeadline?.split("T")[0] || "",
          komunaId: proposal.komunaId ?? "",
        });

        setCurrentFiles(proposal.files ?? []);
      } catch (err) {
        console.log(err);
      }
    };

    loadProposal();
  }, [id]);

  const handleChange = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => setNewFiles(Array.from(e.target.files));

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([k, v]) => {
        formData.append(k, v);
      });

      newFiles.forEach((f) => formData.append("files", f));
      deletedFileIds.forEach((f) => formData.append("deletedFileIds", f));

      await ProposalService.update(id, formData);
      navigate("/staff-dashboard/lista-propozimeve");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileEdit className="text-[#010694]" />
              Modifiko Propozimin
            </h1>
            <p className="text-sm text-slate-500">
              Përditëso të dhënat e projektit
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition w-full sm:w-auto justify-center"
          >
            <ArrowLeft size={18} />
            Kthehu
          </button>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6">
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* TITLE */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Titulli
                </label>
                <input
                  name="title"
                  value={data.title}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#010694] outline-none"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Përshkrimi
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={data.description}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#010694] outline-none"
                />
              </div>

              {/* BUDGET */}
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign size={14} /> Buxheti
                </label>
                <input
                  name="budget"
                  type="number"
                  value={data.budget}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#010694]"
                />
              </div>

              {/* COMPANY */}
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Building size={14} /> Kompania
                </label>
                <input
                  name="tenderWinnerCompany"
                  value={data.tenderWinnerCompany}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#010694]"
                />
              </div>

              {/* DATES */}
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar size={14} /> Fillimi
                </label>
                <input
                  type="date"
                  name="plannedStartDate"
                  value={data.plannedStartDate}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar size={14} /> Fundi
                </label>
                <input
                  type="date"
                  name="plannedEndDate"
                  value={data.plannedEndDate}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar size={14} /> Afati votimit
                </label>
                <input
                  type="date"
                  name="votingDeadline"
                  value={data.votingDeadline}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Komuna ID</label>
                <input
                  name="komunaId"
                  type="number"
                  value={data.komunaId}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200"
                />
              </div>

              {/* FILES */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Foto të reja</label>
                <input
                  type="file"
                  multiple
                  className="mt-2 w-full"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* EXISTING FILES */}
            {currentFiles.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Fotot aktuale
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentFiles.map((file) => (
                    <div
                      key={file.id}
                      className="border rounded-xl overflow-hidden bg-slate-50"
                    >
                      <img
                        src={file.fileUrl}
                        className="h-28 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setDeletedFileIds((p) => [...p, file.id]);
                          setCurrentFiles((p) =>
                            p.filter((x) => x.id !== file.id),
                          );
                        }}
                        className="w-full text-xs py-2 text-red-600 hover:bg-red-50"
                      >
                        Hiqe
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-xl border text-slate-600 hover:bg-slate-50 w-full sm:w-auto"
              >
                Anulo
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#010694] text-white flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-[#0208c7]"
              >
                <Save size={18} />
                Ruaj
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProjectProposal;
