import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IssueService } from "../services/IssueServices";
import { Save, ArrowLeft, FileEdit, ImagePlus, Tags } from "lucide-react";

function EditIssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    title: "",
    description: "",
    issueCategoryId: "",
  });

  const [currentFiles, setCurrentFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIssue = async () => {
      try {
        const response = await IssueService.getById(id);
        const issue = response.data;

        setData({
          title: issue.title ?? "",
          description: issue.description ?? "",
          issueCategoryId: issue.issueCategoryId ?? "",
        });

        setCurrentFiles(issue.files ?? []);
      } catch (err) {
        console.log(err.response?.data || err.message);
        alert("Gabim gjatë leximit të issue.");
      } finally {
        setLoading(false);
      }
    };

    loadIssue();
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

      formData.append("Title", data.title);
      formData.append("Description", data.description);
      formData.append("IssueCategoryId", data.issueCategoryId);

      newFiles.forEach((file) => {
        formData.append("Files", file);
      });

      await IssueService.updateDetails(id, formData);

      navigate("/issues");
    } catch (err) {
      console.log("ERRORS:", err.response?.data?.errors);
      console.log(err.response?.data || err.message);
      alert("Gabim gjatë përditësimit të issue.");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 font-medium">Duke u ngarkuar...</p>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <FileEdit className="text-[#010694]" size={24} />
            Përditëso Issue
          </h1>
          <p className="text-sm text-slate-500">
            Ndryshoni detajet e raportimit më poshtë.
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
        >
          <ArrowLeft size={18} /> Kthehu
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Titulli
              </label>
              <input
                name="title"
                value={data.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#010694] focus:border-transparent outline-none transition"
                placeholder="Shkruani titullin..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Përshkrimi
              </label>
              <textarea
                name="description"
                rows="5"
                value={data.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#010694] focus:border-transparent outline-none transition"
                placeholder="Përshkruani problemin..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Tags size={16} />
                ID e Kategorisë
              </label>
              <input
                name="issueCategoryId"
                type="number"
                value={data.issueCategoryId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#010694] focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <ImagePlus size={16} />
                Shto Foto të Reja
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fotot aktuale
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentFiles.map((file) => (
                  <div
                    key={file.id}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50"
                  >
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

export default EditIssueDetails;
