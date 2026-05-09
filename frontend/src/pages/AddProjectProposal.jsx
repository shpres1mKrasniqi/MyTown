import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProposalService } from "../services/proposalService";
import { komunaService } from "../services/komunaService";

function AddProjectProposal() {
  const initialForm = {
    title: "",
    description: "",
    budget: "",
    plannedStartDate: "",
    plannedEndDate: "",
    tenderWinnerCompany: "",
    votingDeadline: "",
    komunaId: "",
    files: [],
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [komunat, setKomunat] = useState([]);

  useEffect(() => {
    const fetchKomunat = async () => {
      try {
        const res = await komunaService.getAll();
        setKomunat(res.data);
      } catch (err) {
        console.error("Gabim gjatë marrjes së komunave:", err);
        toast.error("Komunat nuk u ngarkuan.");
      }
    };

    fetchKomunat();
  }, []);

  const showToast = (type, message) => {
    toast.dismiss();

    toast[type](message, {
      toastId: "main-toast",
      onClick: () => toast.dismiss("main-toast"),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    setForm((prev) => ({
      ...prev,
      files: [...prev.files, ...selectedFiles],
    }));

    e.target.value = "";
  };

  const removeFile = (index) => {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const normalizeFieldName = (key) => {
    const lowerKey = key.toLowerCase();

    if (lowerKey.includes("title")) return "title";
    if (lowerKey.includes("description")) return "description";
    if (lowerKey.includes("budget")) return "budget";
    if (lowerKey.includes("plannedstartdate")) return "plannedStartDate";
    if (lowerKey.includes("plannedenddate")) return "plannedEndDate";
    if (lowerKey.includes("tenderwinnercompany")) return "tenderWinnerCompany";
    if (lowerKey.includes("votingdeadline")) return "votingDeadline";
    if (lowerKey.includes("komunaid")) return "komunaId";
    if (lowerKey.includes("files")) return "files";

    return key.charAt(0).toLowerCase() + key.slice(1);
  };

  const formatBackendErrors = (responseErrors) => {
    const formattedErrors = {};

    Object.keys(responseErrors).forEach((key) => {
      const fieldName = normalizeFieldName(key);
      const messages = responseErrors[key];

      formattedErrors[fieldName] = Array.isArray(messages)
        ? messages[0]
        : messages;
    });

    return formattedErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    const data = new FormData();

    data.append("Title", form.title);
    data.append("Description", form.description);
    data.append("Budget", form.budget);
    data.append("PlannedStartDate", form.plannedStartDate);
    data.append("PlannedEndDate", form.plannedEndDate);
    data.append("TenderWinnerCompany", form.tenderWinnerCompany);
    data.append("VotingDeadline", form.votingDeadline);
    data.append("KomunaId", form.komunaId);

    form.files.forEach((file) => {
      data.append("Files", file);
    });

    try {
      await ProposalService.create(data);

      showToast("success", "Project Proposal u krijua me sukses!");
      setForm(initialForm);
    } catch (err) {
      console.error("Gabim gjatë krijimit:", err.response?.data || err);

      const backendData = err.response?.data;

      if (backendData?.errors) {
        setErrors(formatBackendErrors(backendData.errors));
        return;
      }

      if (backendData?.message) {
        showToast("error", backendData.message);
        return;
      }

      if (backendData?.title) {
        showToast("error", backendData.title);
        return;
      }

      showToast("error", "Gabim gjatë krijimit të Project Proposal.");
    }
  };

  const getInputClasses = (fieldName) => `
    w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all duration-200
    ${
      errors[fieldName]
        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
        : "border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
    }
  `;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-gray-800">
            Krijo Project Proposal
          </h2>

          <p className="text-gray-500 mt-1">Plotësoni të dhënat më poshtë.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Titulli
            </label>

            <input
              type="text"
              name="title"
              placeholder="Titulli i projektit"
              value={form.title}
              onChange={handleChange}
              className={getInputClasses("title")}
            />

            {errors.title && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Përshkrimi
            </label>

            <textarea
              name="description"
              rows="4"
              placeholder="Përshkrimi i projektit..."
              value={form.description}
              onChange={handleChange}
              className={`${getInputClasses("description")} resize-none`}
            />

            {errors.description && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Buxheti
            </label>

            <input
              type="number"
              name="budget"
              placeholder="10000"
              value={form.budget}
              onChange={handleChange}
              className={getInputClasses("budget")}
            />

            {errors.budget && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.budget}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Data e Fillimit
              </label>

              <input
                type="datetime-local"
                name="plannedStartDate"
                value={form.plannedStartDate}
                onChange={handleChange}
                className={getInputClasses("plannedStartDate")}
              />

              {errors.plannedStartDate && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.plannedStartDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Data e Përfundimit
              </label>

              <input
                type="datetime-local"
                name="plannedEndDate"
                value={form.plannedEndDate}
                onChange={handleChange}
                className={getInputClasses("plannedEndDate")}
              />

              {errors.plannedEndDate && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.plannedEndDate}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Kompania Fituese
              </label>

              <input
                type="text"
                name="tenderWinnerCompany"
                placeholder="Emri i kompanisë"
                value={form.tenderWinnerCompany}
                onChange={handleChange}
                className={getInputClasses("tenderWinnerCompany")}
              />

              {errors.tenderWinnerCompany && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.tenderWinnerCompany}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Voting Deadline
              </label>

              <input
                type="datetime-local"
                name="votingDeadline"
                value={form.votingDeadline}
                onChange={handleChange}
                className={getInputClasses("votingDeadline")}
              />

              {errors.votingDeadline && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.votingDeadline}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Komuna
            </label>

            <select
              name="komunaId"
              value={form.komunaId}
              onChange={handleChange}
              className={getInputClasses("komunaId")}
            >
              <option value="">Zgjidh komunën</option>

              {komunat.map((komuna) => (
                <option key={komuna.id} value={komuna.id}>
                  {komuna.name || komuna.emri || komuna.title}
                </option>
              ))}
            </select>

            {errors.komunaId && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.komunaId}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Dokumente / Foto
            </label>

            <div
              className={`mt-1 border-2 border-dashed rounded-xl p-6 transition-colors bg-gray-50/50 ${
                errors.files
                  ? "border-red-400"
                  : "border-gray-200 hover:border-blue-400"
              }`}
            >
              <div className="space-y-1 text-center">
                <label className="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                  <span>Ngarko dokumente</span>

                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>

                <p className="text-xs text-gray-400">PDF, JPG, PNG, DOCX...</p>

                {form.files.length > 0 && (
                  <p className="text-xs text-green-600 font-medium pt-1">
                    {form.files.length} file u zgjodhën
                  </p>
                )}
              </div>

              {form.files.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {form.files.map((file, index) => (
                    <div
                      key={index}
                      className="relative bg-white border rounded-lg px-3 py-2 text-sm"
                    >
                      <span className="pr-5">{file.name}</span>

                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errors.files && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.files}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3.5 rounded-xl"
          >
            Krijo Project Proposal
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProjectProposal;
