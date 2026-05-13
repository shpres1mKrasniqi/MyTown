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
          plannedStartDate: proposal.plannedStartDate
            ? proposal.plannedStartDate.split("T")[0]
            : "",
          plannedEndDate: proposal.plannedEndDate
            ? proposal.plannedEndDate.split("T")[0]
            : "",
          tenderWinnerCompany: proposal.tenderWinnerCompany ?? "",
          votingDeadline: proposal.votingDeadline
            ? proposal.votingDeadline.split("T")[0]
            : "",
          komunaId: proposal.komunaId ?? "",
        });

        setCurrentFiles(proposal.files ?? []);
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    };

    loadProposal();
  }, [id]);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setNewFiles(Array.from(e.target.files));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("budget", Number(data.budget));
      formData.append("plannedStartDate", data.plannedStartDate || "");
      formData.append("plannedEndDate", data.plannedEndDate || "");
      formData.append("tenderWinnerCompany", data.tenderWinnerCompany || "");
      formData.append("votingDeadline", data.votingDeadline);
      formData.append("komunaId", Number(data.komunaId));

      newFiles.forEach((file) => {
        formData.append("files", file);
      });

      deletedFileIds.forEach((id) => {
        formData.append("deletedFileIds", id);
      });

      await ProposalService.update(id, formData);

      navigate("/lista-propozimeve");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <FileEdit className="text-[#010694]" size={24} />
            Modifiko Propozimin
          </h1>
          <p className="text-sm text-slate-500">
            Përditësoni detajet e projektit më poshtë.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
        >
          <ArrowLeft size={18} /> Kthehu
        </button>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Titulli */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Titulli i Projektit
              </label>
              <input
                name="title"
                value={data.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#010694] focus:border-transparent outline-none transition"
                placeholder="Shkruani titullin..."
              />
            </div>

            {/* Pershkrimi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Përshkrimi
              </label>
              <textarea
                name="description"
                rows="4"
                value={data.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#010694] focus:border-transparent outline-none transition"
                placeholder="Përshkruani projektin në detaje..."
              />
            </div>

            {/* Buxheti */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <DollarSign size={16} /> Buxheti (€)
              </label>
              <input
                name="budget"
                type="number"
                value={data.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#010694] focus:border-transparent outline-none transition"
              />
            </div>

            {/* Kompania */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Building size={16} /> Kompania Fituese
              </label>
              <input
                name="tenderWinnerCompany"
                value={data.tenderWinnerCompany}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#010694] focus:border-transparent outline-none transition"
                placeholder="Emri i kompanisë"
              />
            </div>

            {/* Datat */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Calendar size={16} /> Data e Fillimit
              </label>
              <input
                name="plannedStartDate"
                type="date"
                value={data.plannedStartDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#010694] focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Calendar size={16} /> Data e Mbarimit
              </label>
              <input
                name="plannedEndDate"
                type="date"
                value={data.plannedEndDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#010694] focus:border-transparent outline-none transition"
              />
            </div>

            {/* Afati i Votimit */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Calendar size={16} className="text-purple-600" /> Afati i
                Votimit
              </label>
              <input
                name="votingDeadline"
                type="date"
                value={data.votingDeadline}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Komuna ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                ID e Komunës
              </label>
              <input
                name="komunaId"
                type="number"
                value={data.komunaId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#010694] focus:border-transparent outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Ndrysho / Shto Foto
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {currentFiles.length > 0 && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fotot aktuale
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentFiles.map((file) => (
                  <div
                    key={file.id}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setDeletedFileIds((prev) => [...prev, file.id]);
                        setCurrentFiles((prev) =>
                          prev.filter((x) => x.id !== file.id),
                        );
                      }}
                      className="mt-2 w-full text-xs bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200"
                    >
                      Hiqe
                    </button>
                    <img
                      src={file.fileUrl}
                      alt={file.fileName}
                      className="w-full h-32 object-cover"
                    />

                    <div className="p-2">
                      <p className="text-xs text-slate-500 truncate">
                        {file.fileName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Anulo
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#010694] text-white px-8 py-3 rounded-xl shadow-lg hover:bg-[#0208c7] transition-all font-medium"
            >
              <Save size={18} />
              Ruaj Ndryshimet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProjectProposal;
