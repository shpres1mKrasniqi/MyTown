import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { idScanService } from "../services/idScanService";
import { citizenService } from "../services/citizenService";
import { komunaService } from "../services/komunaService";

export default function CreateCitizen() {
  const initialForm = {
    firstName: "",
    lastName: "",
    personalNumber: "",
    dateOfBirth: "",
    nationality: "",
    placeOfBirth: "",
    email: "",
    password: "",
    komunaId: "",
    phoneNumber: "",
    address: "",
  };

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [komunat, setKomunat] = useState([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(initialForm);

  const showToast = (type, message) => {
    toast.dismiss();

    toast[type](message, {
      toastId: "main-toast",
      onClick: () => toast.dismiss("main-toast"),
    });
  };

  useEffect(() => {
    fetchKomunat();
  }, []);

  const fetchKomunat = async () => {
    try {
      const res = await komunaService.getAll();
      setKomunat(res.data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së komunave:", err);
    }
  };

  const handleScan = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);
    setLoading(true);

    try {
      const res = await idScanService.extract(formData);
      const data = res.data;

      setForm((prev) => ({
        ...prev,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        personalNumber: data.personalNumber || "",
        dateOfBirth: data.dateOfBirth || "",
        nationality: data.nationality || "",
        placeOfBirth: data.placeOfBirth || "",
      }));
    } catch (err) {
      console.error("Scan error:", err);
    } finally {
      setLoading(false);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const payload = {
        ...form,
        komunaId: Number(form.komunaId),
      };

      await citizenService.create(payload);

      showToast("success", "Qytetari u krijua me sukses!");
      setForm(initialForm);
      setFile(null);
    } catch (err) {
      console.error("Create citizen error:", err);

      const responseErrors = err.response?.data?.errors;

      if (responseErrors) {
        const formattedErrors = {};

        Object.keys(responseErrors).forEach((key) => {
          const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
          formattedErrors[fieldName] = responseErrors[key][0];
        });

        setErrors(formattedErrors);
        return;
      }

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.title ||
        "Ndodhi një gabim gjatë krijimit të qytetarit.";

      showToast("error", backendMessage);
    }
  };

  const fields = [
    { name: "firstName", label: "Emri", type: "text" },
    { name: "lastName", label: "Mbiemri", type: "text" },
    { name: "personalNumber", label: "Numri ID/Nr.Personal", type: "text" },
    { name: "dateOfBirth", label: "Data e Lindjes", type: "date" },
    { name: "nationality", label: "Shtetësia", type: "text" },
    { name: "placeOfBirth", label: "Vendi i Lindjes", type: "text" },
    { name: "email", label: "Email Adresa", type: "email" },
    { name: "password", label: "Fjalëkalimi", type: "password" },
    { name: "phoneNumber", label: "Nr. Telefonit", type: "tel" },
  ];

  return (
    <div className="min-h-screen bg-[#f2f2f2] py-12 px-4 font-sans text-[#1b1b1b]">
      <div className="max-w-[860px] mx-auto bg-white shadow-md border border-gray-200">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-[#1b1b1b]">
            Krijo llogarinë
          </h2>
          <p className="text-[#666] mt-1 text-[15px]">
            Plotësoni të dhënat manualisht ose përdorni skanimin AI.
          </p>
        </div>

        <div className="p-8">
          <div className="mb-10 p-5 bg-[#f3f2f1] border-l-4 border-[#0067b8]">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Skano Letërnjoftimin (AI Scan)
            </label>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:bg-white file:text-gray-700 hover:file:bg-gray-50 cursor-pointer"
              />

              <button
                type="button"
                onClick={handleScan}
                disabled={loading || !file}
                className={`px-6 py-2 text-[15px] transition-all min-w-[160px] ${
                  loading || !file
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-[#0067b8] text-[#0067b8] hover:bg-[#f3f2f1]"
                }`}
              >
                {loading ? "Duke u skanuar..." : "Skano Dokumentin"}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1">
                    {field.label}
                  </label>

                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.label}
                    className={`w-full px-0 py-1.5 border-b outline-none transition-colors placeholder:text-gray-300 text-[15px] ${
                      errors[field.name]
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-400 focus:border-[#0067b8]"
                    }`}
                  />

                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1">
                  Komuna
                </label>

                <select
                  name="komunaId"
                  value={form.komunaId}
                  onChange={handleChange}
                  className={`w-full px-0 py-1.5 border-b outline-none bg-transparent text-[15px] ${
                    errors.komunaId
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-400 focus:border-[#0067b8]"
                  }`}
                >
                  <option value="">Zgjedh komunën</option>
                  {komunat.map((komuna) => (
                    <option key={komuna.id} value={komuna.id}>
                      {komuna.name}
                    </option>
                  ))}
                </select>

                {errors.komunaId && (
                  <p className="text-red-500 text-sm mt-1">{errors.komunaId}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-[14px] font-semibold text-gray-700 mb-1">
                  Adresa
                </label>

                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Prishtine, Veternik, Rruga B, 15"
                  className={`w-full px-0 py-1.5 border-b outline-none transition-colors text-[15px] ${
                    errors.address
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-400 focus:border-[#0067b8]"
                  }`}
                />

                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
            </div>

            <div className="pt-8 flex justify-end">
              <button
                type="submit"
                className="bg-[#0067b8] hover:bg-[#005da6] text-white font-normal py-2 px-10 text-[15px] min-w-[120px] transition-colors"
              >
                Krijo Profilin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
