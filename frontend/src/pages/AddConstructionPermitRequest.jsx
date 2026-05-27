import { useState } from "react";
import { constructionPermitsService } from "../services/constructionPermitsService";
import { toast } from "react-toastify";
import { FileText, Plus, Trash2, UploadCloud, AlertCircle } from "lucide-react";

function AddConstructionPermitRequest() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [documents, setDocuments] = useState([{ file: null, type: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Titulli është i detyrueshëm");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Description", description);

      const validDocuments = documents.filter((doc) => doc.file !== null);

      validDocuments.forEach((doc, index) => {
        formData.append(`Documents[${index}].File`, doc.file);
        formData.append(`Documents[${index}].Type`, doc.type);
      });

      await constructionPermitsService.create(formData);
      toast.success("Kërkesa u dërgua me sukses!");

      setTitle("");
      setDescription("");
      setDocuments([{ file: null, type: "" }]);
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data || "Gabim gjatë dërgimit";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentField = (index, field, value) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc, i) =>
        i === index ? { ...doc, [field]: value } : doc,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 sm:p-10">
        <div className="mb-8 border-b border-slate-100 pb-5">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            Kërko leje për ndërtim
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Plotësoni formularin e mëposhtëm dhe ngarkoni dokumentet e
            nevojshme.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Titulli i kërkesës
            </label>
            <input
              type="text"
              placeholder="Shkruani titullin e lejes..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition-all disabled:bg-slate-50 disabled:text-slate-500 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Përshkrimi
            </label>
            <textarea
              rows={3}
              placeholder="Përshkruani shkurtimisht arsyen ose detajet..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition-all disabled:bg-slate-50 disabled:text-slate-500 text-sm resize-none"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-900">
                Dokumentet e bashkangjitura
              </h3>
            </div>

            {documents.map((doc, index) => (
              <div
                key={index}
                className="group relative grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-4 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors duration-200"
              >
                <div className="md:col-span-6 relative">
                  <label className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 transition-colors text-sm text-slate-600 shadow-2xs">
                    <UploadCloud className="w-4 h-4 text-slate-400" />
                    <span className="truncate max-w-[200px]">
                      {doc.file ? doc.file.name : "Zgjidh skedarin..."}
                    </span>
                    <input
                      type="file"
                      onChange={(e) =>
                        updateDocumentField(index, "file", e.target.files[0])
                      }
                      disabled={loading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="md:col-span-5">
                  <select
                    value={doc.type}
                    onChange={(e) =>
                      updateDocumentField(
                        index,
                        "type",
                        e.target.value !== "" ? Number(e.target.value) : "",
                      )
                    }
                    disabled={loading}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-600 text-sm shadow-2xs"
                  >
                    <option value="">Zgjidh tipin</option>
                    <option value={0}>Projekti Kryesor</option>
                    <option value={1}>Projekti Ideor</option>
                    <option value={2}>Projekt Koncepti</option>
                  </select>
                </div>

                <div className="md:col-span-1 flex justify-end">
                  {documents.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setDocuments(documents.filter((_, i) => i !== index))
                      }
                      disabled={loading}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg hover:cursor-pointer transition-all disabled:opacity-50"
                      title="Hiq dokumentin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setDocuments([...documents, { file: null, type: "" }])
              }
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-sm rounded-xl transition-all shadow-2xs active:scale-[0.98] disabled:opacity-50"
            >
              <Plus className="w-4 h-4 text-slate-500" />
              Shto Dokument
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm hover:shadow-md focus:ring-4 focus:ring-blue-500/20 active:scale-[0.98] disabled:bg-blue-400 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Duke u dërguar...
                </>
              ) : (
                "Dërgo Kërkesën"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddConstructionPermitRequest;
