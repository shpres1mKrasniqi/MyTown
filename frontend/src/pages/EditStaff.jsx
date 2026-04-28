import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { staffService } from "../services/staffService";
import { departmentService } from "../services/departmentService";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Briefcase,
  Calendar,
  Loader2,
} from "lucide-react";

export default function EditStaff() {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    dateHired: "",
    departmentId: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
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
        setFetching(true);

        const [staffRes, deptRes] = await Promise.all([
          staffService.getById(id),
          departmentService.getAll(),
        ]);

        const staff = staffRes.data;

        setForm({
          firstName: staff.firstName || "",
          lastName: staff.lastName || "",
          email: staff.email || "",
          position: staff.position || "",
          dateHired: staff.dateHired || "",
          departmentId: staff.departmentId || "",
        });

        setDepartments(deptRes.data || []);
      } catch (err) {
        console.error("Gabim gjatë marrjes së stafit:", err);
        showToast("error", "Gabim gjatë marrjes së të dhënave.");
        navigate("/manage-staff");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const normalizeFieldName = (key) => {
    const lowerKey = key.toLowerCase();

    if (lowerKey.includes("firstname")) return "firstName";
    if (lowerKey.includes("lastname")) return "lastName";
    if (lowerKey.includes("email")) return "email";
    if (lowerKey.includes("position")) return "position";
    if (lowerKey.includes("datehired")) return "dateHired";
    if (lowerKey.includes("departmentid")) return "departmentId";

    return key.charAt(0).toLowerCase() + key.slice(1);
  };

  const formatBackendErrors = (responseErrors) => {
    const formatted = {};

    Object.keys(responseErrors).forEach((key) => {
      const field = normalizeFieldName(key);
      const messages = responseErrors[key];

      formatted[field] = Array.isArray(messages) ? messages[0] : messages;
    });

    return formatted;
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

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      position: form.position,
      dateHired: form.dateHired || null,
      departmentId: Number(form.departmentId),
    };

    try {
      await staffService.update(id, payload);

      showToast("success", "Profili i stafit u përditësua me sukses!");
      navigate("/manage-staff");
    } catch (err) {
      console.error("Gabim gjatë editimit:", err.response?.data || err);

      const backendData = err.response?.data;

      if (backendData?.errors) {
        setErrors(formatBackendErrors(backendData.errors));
        return;
      }

      const message =
        backendData?.message || backendData?.title || "Përditësimi dështoi.";

      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  const getInputClasses = (field) =>
    `w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none transition-all text-sm ${
      errors[field]
        ? "border-red-400 focus:ring-2 focus:ring-red-200"
        : "border-slate-200 focus:ring-2 focus:ring-[#010694]/20 focus:border-[#010694]"
    }`;

  if (fetching) {
    return (
      <div className="flex justify-center flex-col gap-2 items-center h-64 text-slate-500">
        <Loader2 className="animate-spin text-[#010694]" size={32} />
        <div className="font-medium">Po ngarkohen të dhënat...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#010694]"
        >
          <ArrowLeft size={18} />
          Kthehu mbrapa
        </button>

        <h1 className="text-2xl font-semibold text-slate-900">
          Edito Profilin e Stafit
        </h1>

        <p className="text-sm text-slate-500">
          ID:
          <span className="font-bold text-[#010694] ml-1">{id}</span>
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold">Emri</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={getInputClasses("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold">Mbiemri</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={getInputClasses("lastName")}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className={getInputClasses("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold">Pozita</label>
            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              className={getInputClasses("position")}
            />
            {errors.position && (
              <p className="text-red-500 text-sm mt-1">{errors.position}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold">Data e Punësimit</label>
              <input
                type="date"
                name="dateHired"
                value={form.dateHired}
                onChange={handleChange}
                className={getInputClasses("dateHired")}
              />
              {errors.dateHired && (
                <p className="text-red-500 text-sm mt-1">{errors.dateHired}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold">Departamenti</label>
              <select
                name="departmentId"
                value={form.departmentId}
                onChange={handleChange}
                className={getInputClasses("departmentId")}
              >
                <option value="">Zgjidhni...</option>

                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              {errors.departmentId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.departmentId}
                </p>
              )}
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-2.5 border rounded-xl"
            >
              Anulo
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-[2] flex items-center justify-center gap-2 bg-[#010694] text-white px-4 py-2.5 rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Duke ruajtur...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Ruaj Ndryshimet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
