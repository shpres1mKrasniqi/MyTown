import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: location.state?.email || "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizeFieldName = (key) => {
    const lowerKey = key.toLowerCase();

    if (lowerKey.includes("email")) return "email";
    if (lowerKey.includes("code")) return "code";
    if (lowerKey.includes("newpassword")) return "newPassword";

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

    setGeneralError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setErrors({});
    setGeneralError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await resetPassword({
        email: form.email,
        code: form.code,
        newPassword: form.newPassword,
      });

      setSuccess(res.message || "Fjalëkalimi u rivendos me sukses.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Reset password error:", err.response?.data || err);

      const backendData = err.response?.data;

      if (backendData?.errors) {
        setErrors(formatBackendErrors(backendData.errors));
        return;
      }

      const message =
        backendData?.message ||
        backendData?.title ||
        "Ndodhi një gabim gjatë rivendosjes së fjalëkalimit.";

      setGeneralError(message);
    } finally {
      setLoading(false);
    }
  };

  const getInputClasses = (fieldName) =>
    `w-full border bg-white px-3 py-2 outline-none transition-colors text-sm ${
      errors[fieldName]
        ? "border-red-500 focus:border-red-500"
        : "border-gray-300 focus:border-blue-600"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md border-t border-blue-600 bg-white p-8">
        <h2 className="text-xl font-normal mb-2 text-gray-900">
          Reset Password
        </h2>

        <p className="text-gray-500 text-sm mb-8">
          Shkruani kodin dhe fjalëkalimin e ri.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label className="block mb-2 text-sm font-normal text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={getInputClasses("email")}
            />

            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-normal text-gray-700">
              Kodi
            </label>

            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Kodi 6-shifror"
              className={getInputClasses("code")}
            />

            {errors.code && (
              <p className="text-sm text-red-500 mt-1">{errors.code}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-normal text-gray-700">
              Fjalëkalimi i ri
            </label>

            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className={getInputClasses("newPassword")}
            />

            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-normal text-gray-700">
              Konfirmo fjalëkalimin
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={getInputClasses("confirmPassword")}
            />
          </div>

          {generalError && (
            <div className="border-l-2 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-600">
              {generalError}
            </div>
          )}

          {success && (
            <div className="border-l-2 border-green-500 bg-green-50 px-3 py-2 text-sm text-green-600">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-blue-600 bg-blue-600 text-white hover:bg-white hover:text-blue-600 py-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Duke ruajtur..." : "Rivendos fjalëkalimin"}
          </button>
        </form>
      </div>
    </div>
  );
}
