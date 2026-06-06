import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      <div className="w-full lg:w-1/2 bg-gray-100 flex justify-center items-center p-6 sm:p-12">
        <div className="max-w-md w-full text-center">
          <h1 className="text-gray-900 font-bold text-3xl sm:text-4xl mb-3">
            Regjistrohu si qytetar
          </h1>
          <p className="text-gray-500 text-sm mb-6 sm:text-sm sm:mb-8">
            Krijoni llogarinë tuaj në MyTown ose përdorni shërbimin inteligjent
            AI Scan duke ngarkuar një foto të letërnjoftimit/pasaportës.
          </p>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
            <label className="block text-gray-700 text-sm font-semibold mb-3 text-left pl-2">
              Skano Letërnjoftimin (AI Scan)
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-gray-700 text-sm w-full file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
            />

            <button
              type="button"
              onClick={handleScan}
              disabled={loading || !file}
              className="block w-full bg-gradient-to-br from-purple-800 from-blue-700 to-blue-500 text-white mt-5 py-3 rounded-full font-semibold tracking-wide transition hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Duke skenuar..." : "Skano Dokumentin"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 justify-center items-center bg-gradient-to-br from-purple-800 from-blue-700 to-blue-500 overflow-y-auto py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md px-8 my-auto">
          <h1 className="text-white font-bold text-3xl mb-2 text-center">
            Krijo Llogari
          </h1>
          <p className="text-white/80 text-sm mb-6 text-center">
            Plotësoni formularin e mëposhtëm me të dhënat tuaja zyrtare.
          </p>

          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.name} className="w-full">
                {f.type === "date" && (
                  <label className="block text-xs font-semibold text-white/70 mb-1 uppercase tracking-wider text-left pl-4">
                    Datëlindja
                  </label>
                )}
                <input
                  type={f.type || "text"}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.type === "date" ? "" : f.placeholder}
                  className={`w-full py-3 px-5 rounded-full bg-white/90 outline-none text-gray-800 placeholder-gray-400 text-sm transition-all ${
                    errors[f.name] ? "ring-2 ring-red-400 bg-white" : ""
                  }`}
                />
                {errors[f.name] && (
                  <p className="text-red-200 text-xs mt-1 font-medium pl-4 text-left">
                    {errors[f.name]}
                  </p>
                )}
              </div>
            ))}

            <div className="w-full">
              <select
                name="komunaId"
                value={form.komunaId}
                onChange={handleChange}
                className={`w-full py-3 px-5 rounded-full bg-white/90 outline-none text-sm text-gray-800 cursor-pointer transition-all ${
                  errors.komunaId ? "ring-2 ring-red-400 bg-white" : ""
                }`}
              >
                <option value="" className="text-gray-400">
                  Përzgjidhni Komunën
                </option>
                {komunat.map((k) => (
                  <option key={k.id} value={k.id} className="text-gray-800">
                    {k.name}
                  </option>
                ))}
              </select>
              {errors.komunaId && (
                <p className="text-red-200 text-xs mt-1 font-medium pl-4 text-left">
                  {errors.komunaId}
                </p>
              )}
            </div>

            <div className="w-full">
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Prishtine, Veterrnik, Rruga, Nr"
                className={`w-full py-3 px-5 rounded-full bg-white/90 outline-none text-gray-800 placeholder-gray-400 text-sm transition-all ${
                  errors.address ? "ring-2 ring-red-400 bg-white" : ""
                }`}
              />
              {errors.address && (
                <p className="text-red-200 text-xs mt-1 font-medium pl-4 text-left">
                  {errors.address}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="block w-full bg-yellow-400 mt-6 py-3 text-white font-semibold rounded-full hover:bg-yellow-500 transition hover:cursor-pointer text-center"
          >
            Krijo Profilin
          </button>

          <div className="flex justify-center mt-4 text-sm">
            <Link
              to="/login"
              className="text-white/80 hover:text-white font-semibold hover:underline"
            >
              Keni llogari? Kyçu këtu
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
