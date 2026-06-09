import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { citizenService } from "../services/citizenService";
import { komunaService } from "../services/komunaService";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  MapPin,
  Phone,
  Loader2,
  X,
} from "lucide-react";

export default function EditCitizen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    komunaId: "",
    phoneNumber: "",
    address: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [komunas, setKomunas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const showToast = (type, message) => {
    toast.dismiss();
    toast[type](message, {
      toastId: "main-toast",
      onClick: () => toast.dismiss("main-toast"),
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citizenRes, komunaRes] = await Promise.all([
          citizenService.getById(id),
          komunaService.getAll(),
        ]);

        const citizen = citizenRes.data;

        setForm({
          firstName: citizen.firstName || "",
          lastName: citizen.lastName || "",
          email: citizen.email || "",
          komunaId: citizen.komunaId || "",
          phoneNumber: citizen.phoneNumber || "",
          address: citizen.address || "",
        });

        setKomunas(komunaRes.data);
      } catch (err) {
        console.error("Gabim gjatë marrjes së qytetarit:", err);
        showToast("error", "Gabim gjatë marrjes së të dhënave!");
        navigate("/MenaxhoCitizens");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchData();
  }, [id, navigate]);

  const normalizeFieldName = (key) => {
    const lowerKey = key.toLowerCase();

    if (lowerKey.includes("firstname")) return "firstName";
    if (lowerKey.includes("lastname")) return "lastName";
    if (lowerKey.includes("email")) return "email";
    if (lowerKey.includes("komunaid")) return "komunaId";
    if (lowerKey.includes("phonenumber")) return "phoneNumber";
    if (lowerKey.includes("address")) return "address";

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

    if (loading) return;

    setErrors({});
    setLoading(true);

    try {
      await citizenService.update(id, {
        ...form,
        komunaId: Number(form.komunaId),
      });

      showToast("success", "Qytetari u përditësua me sukses.");
      navigate("/MenaxhoCitizens");
    } catch (err) {
      console.error("Gabim gjatë përditësimit:", err.response?.data || err);

      const backendData = err.response?.data;

      if (backendData?.errors) {
        setErrors(formatBackendErrors(backendData.errors));
        return;
      }

      const backendMessage =
        backendData?.message || backendData?.title || "Përditësimi dështoi.";

      showToast("error", backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const getInputClasses = (fieldName) =>
    `w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm ${
      errors[fieldName]
        ? "border-red-400 focus:ring-red-200 focus:border-red-500"
        : "border-slate-200 focus:ring-[#010694]/20 focus:border-[#010694]"
    }`;

  if (fetching) {
    return (
      <div className="flex justify-center flex-col gap-2 items-center h-64 text-slate-500">
        <Loader2 className="animate-spin text-[#010694]" size={32} />
        <div>Po ngarkon...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#010694] transition-colors w-fit group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Kthehu mbrapa
        </button>

        <h1 className="text-2xl font-semibold text-slate-900">
          Edito Qytetarin
        </h1>

        <p className="text-sm text-slate-500">
          Ndryshoni të dhënat e qytetarit në formën më poshtë.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User size={16} className="text-[#010694]" />
                Emri
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Emri"
                className={getInputClasses("firstName")}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User size={16} className="text-[#010694]" />
                Mbiemri
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Mbiemri"
                className={getInputClasses("lastName")}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Mail size={16} className="text-[#010694]" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className={getInputClasses("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <MapPin size={16} className="text-[#010694]" />
                Komuna
              </label>
              <select
                name="komunaId"
                value={form.komunaId}
                onChange={handleChange}
                className={getInputClasses("komunaId")}
              >
                <option value="">Përzgjidhni komunën</option>
                {komunas.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name}
                  </option>
                ))}
              </select>
              {errors.komunaId && (
                <p className="text-sm text-red-500">{errors.komunaId}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Phone size={16} className="text-[#010694]" />
                Telefoni
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="Numri i telefonit"
                className={getInputClasses("phoneNumber")}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MapPin size={16} className="text-[#010694]" />
              Adresa
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Adresa e plotë"
              className={getInputClasses("address")}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all disabled:opacity-70"
            >
              <X size={18} />
              Anulo
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-[2] flex items-center justify-center gap-2 bg-[#010694] hover:bg-[#1a1e8a] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {loading ? "Duke ruajtur..." : "Ruaj Ndryshimet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
