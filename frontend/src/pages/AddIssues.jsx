import { useEffect, useState } from "react";
import { IssueService } from "../services/IssueServices";
import { komunaService } from "../services/komunaService";
import { issueCategoryService } from "../services/issueCategoryService";

function AddIssue() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    komunaId: "",
    issueCategoryId: "",
    files: [],
  });

  const [komunat, setKomunat] = useState([]);
  const [kategorit, setKategorit] = useState([]);
  const [errors, setErrors] = useState({});

  const titleRegex = /^[A-Za-z0-9\s.,!?'-]{5,80}$/;

  const validateForm = () => {
    let newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Titulli është i detyrueshëm";
    } else if (!titleRegex.test(form.title)) {
      newErrors.title =
        "Titulli duhet të ketë 5-80 karaktere (vetëm shenja bazike)";
    }

    if (!form.description.trim()) {
      newErrors.description = "Përshkrimi është i detyrueshëm";
    } else if (form.description.length < 10 || form.description.length > 500) {
      newErrors.description =
        "Përshkrimi duhet të jetë mes 10 dhe 500 karaktereve";
    }

    if (!form.komunaId) newErrors.komunaId = "Ju lutem zgjedhni komunën";
    if (!form.issueCategoryId)
      newErrors.issueCategoryId = "Ju lutem zgjedhni kategorinë";

    if (form.files.length > 5) {
      newErrors.files = "Mund të ngarkosh maksimum 5 foto";
    }

    const largeFile = form.files.find((file) => file.size > 10 * 1024 * 1024);
    if (largeFile) {
      newErrors.files = "Një prej skedarëve kalon madhësinë 10MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    fetchKomuna();
    fetchKategorit();
  }, []);

  const fetchKomuna = async () => {
    try {
      const res = await komunaService.getAll();
      setKomunat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchKategorit = async () => {
    try {
      const res = await issueCategoryService.getAll();
      setKategorit(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    setForm((prev) => ({
      ...prev,
      files: [...prev.files, ...selectedFiles].slice(0, 5),
    }));

    if (errors.files) setErrors({ ...errors, files: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("komunaId", form.komunaId);
    data.append("issueCategoryId", form.issueCategoryId);
    form.files.forEach((file) => data.append("files", file));

    try {
      await IssueService.create(data);
      alert("Postimi u krijua me sukses!");
      setForm({
        title: "",
        description: "",
        komunaId: "",
        issueCategoryId: "",
        files: [],
      });
      setErrors({});
    } catch (err) {
      alert("Gabim gjatë krijimit!");
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
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-gray-800">
            Raporto një problem
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
              placeholder="Çfarë po ndodh?"
              value={form.title}
              onChange={handleChange}
              className={getInputClasses("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="">Zgjedh...</option>
                {komunat.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name}
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
                Kategoria
              </label>
              <select
                name="issueCategoryId"
                value={form.issueCategoryId}
                onChange={handleChange}
                className={getInputClasses("issueCategoryId")}
              >
                <option value="">Zgjedh...</option>
                {kategorit.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              {errors.issueCategoryId && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.issueCategoryId}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Përshkrimi
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Jepni më shumë detaje..."
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
              Dokumentimi (Foto)
            </label>
            <div
              className={`mt-1 border-2 border-dashed rounded-xl p-6 transition-colors bg-gray-50/50 
            ${errors.files ? "border-red-400" : "border-gray-200 hover:border-blue-400"}`}
            >
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600 justify-center">
                  <label className="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                    <span>Ngarko foto të problemit</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-400">
                  PNG, JPG deri në 10MB (Maks. 5)
                </p>
                {form.files.length > 0 && (
                  <p className="text-xs text-green-600 font-medium pt-1">
                    {form.files.length} skedarë u zgjodhën
                  </p>
                )}
              </div>

              {form.files.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {form.files.map((file, index) => (
                    <div key={index} className="relative h-14 w-14 group">
                      <img
                        src={URL.createObjectURL(file)}
                        className="h-full w-full object-cover rounded-md border"
                        alt="preview"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            files: form.files.filter((_, i) => i !== index),
                          })
                        }
                        className="absolute -top-2 -right-2 bg-black/70 text-white text-[8px] w-5 h-5 flex items-center justify-center rounded-full cursor-pointer hover:bg-red-500 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.files && (
              <p className="text-red-500 text-xs mt-1 text-center">
                {errors.files}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4"
          >
            Dërgo Postimin
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddIssue;
