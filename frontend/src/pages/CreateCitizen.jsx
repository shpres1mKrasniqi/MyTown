import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const showToast = (type, message) => {
    toast.dismiss();
    toast[type](message, {
      toastId: "main-toast",
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
      console.error(err);
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
      showToast("success", "Dokumenti u skenua me sukses!");
    } catch (err) {
      console.error(err);
      showToast("error", "Skenimi dështoi. Provoni përsëri.");
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
      await citizenService.create({
        ...form,
        komunaId: Number(form.komunaId),
      });

      showToast("success", "Llogaria e qytetarit u krijua me sukses!");
      navigate("/");
    } catch (err) {
      const responseErrors = err.response?.data?.errors;

      if (responseErrors) {
        const formatted = {};
        Object.keys(responseErrors).forEach((key) => {
          const k = key.charAt(0).toLowerCase() + key.slice(1);
          formatted[k] = responseErrors[key][0];
        });
        setErrors(formatted);
        return;
      }

      showToast("error", "Gabim gjatë krijimit të llogarisë.");
    }
  };

  const fields = [
    { name: "firstName", placeholder: "Emri" },
    { name: "lastName", placeholder: "Mbiemri" },
    { name: "personalNumber", placeholder: "Numri Personal" },
    { name: "dateOfBirth", type: "date", placeholder: "Datëlindja" },
    { name: "nationality", placeholder: "Shtetësia" },
    { name: "placeOfBirth", placeholder: "Vendlindja" },
    { name: "email", placeholder: "Email Adresa", type: "email" },
    { name: "password", placeholder: "Fjalëkalimi", type: "password" },
    { name: "phoneNumber", placeholder: "Numri i Telefonit" },
  ];

  return (
    <div className="h-screen flex flex-col lg:flex-row">
      <div className="flex w-full lg:w-1/2 bg-gradient-to-r from-blue-800 to-blue-200 justify-around items-center p-8 lg:p-0">
        <div className="max-w-md">
          <h1 className="text-white font-bold text-4xl">
            Regjistrohu si qytetar
          </h1>
          <p className="text-blue-100 mt-3">
            Krijoni llogarinë tuaj në MyTown ose përdorni shërbimin inteligjent
            AI Scan duke ngarkuar një foto të letërnjoftimit/pasaportës.
          </p>

          <div className="mt-8 bg-black/20 p-6 border border-white/10 backdrop-blur-sm rounded-none">
            <label className="block text-white text-sm font-medium mb-2">
              Skano Letërnjoftimin (AI Scan)
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-white text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-white file:text-blue-800 hover:file:bg-blue-50 cursor-pointer"
            />

            <button
              type="button"
              onClick={handleScan}
              disabled={loading || !file}
              className="block w-full bg-white text-blue-800 mt-4 py-2.5 rounded-none font-bold tracking-wide transition hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs"
            >
              {loading ? "Duke skenuar..." : "Skano Dokumentin"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 justify-center items-center lg:bg-gradient-to-r from-blue-200  to-white sm:bg-white py-12 lg:py-0 overflow-y-auto h-full">
        <form onSubmit={handleSubmit} className="w-11/12 max-w-md my-auto px-4">
          <h1 className="text-gray-900 font-bold text-3xl mb-1 tracking-tight">
            Krijo Llogari
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Plotësoni formularin e mëposhtëm me të dhënat tuaja zyrtare.
          </p>

          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.name} className="w-full">
                {f.type === "date" && (
                  <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider text-left">
                    Datëlindja
                  </label>
                )}
                <div
                  className={`flex items-center border bg-white/20 backdrop-blur-sm px-3 py-2.5 rounded-none transition-all ${
                    errors[f.name]
                      ? "border-red-500 bg-red-50/10 focus-within:ring-1 focus-within:ring-red-500"
                      : "border-1 focus-within:border-blue-600 focus-within:bg-white"
                  }`}
                >
                  <input
                    type={f.type || "text"}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.type === "date" ? "" : f.placeholder}
                    className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-400 text-sm"
                  />
                </div>
                {errors[f.name] && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors[f.name]}
                  </p>
                )}
              </div>
            ))}

            <div className="w-full">
              <div
                className={`flex items-center border bg-white/20 backdrop-blur-sm px-3 py-2.5 rounded-none transition-all ${
                  errors.komunaId
                    ? "border-red-500 bg-red-50/10"
                    : "border-1 focus-within:border-blue-600 focus-within:bg-white"
                }`}
              >
                <select
                  name="komunaId"
                  value={form.komunaId}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent text-sm text-gray-400 cursor-pointer"
                >
                  <option value="" className="text-gray-400">
                    Përzgjidhni Komunën
                  </option>
                  {komunat.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.komunaId && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.komunaId}
                </p>
              )}
            </div>

            <div className="w-full">
              <div
                className={`flex items-center border bg-white/20 backdrop-blur-sm px-3 py-2.5 rounded-none transition-all ${
                  errors.address
                    ? "border-red-500 bg-red-50/10"
                    : "border-1 focus-within:border-blue-600 focus-within:bg-white"
                }`}
              >
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Adresa e Vendbanimit"
                  className="outline-none bg-transparent w-full text-gray-800 placeholder-gray-400 text-sm"
                />
              </div>
              {errors.address && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.address}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="block w-full bg-blue-600 hover:bg-blue-700 mt-8 py-3 rounded-none text-white font-bold hover:cursor-pointer tracking-wide transition uppercase text-sm shadow-sm"
          >
            Krijo Profilin
          </button>
        </form>
      </div>
    </div>
  );
}
