import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const formatBackendErrors = (responseErrors) => {
    const formattedErrors = {};

    Object.keys(responseErrors).forEach((key) => {
      const lowerKey = key.toLowerCase();
      const messages = responseErrors[key];

      if (lowerKey.includes("email")) {
        formattedErrors.email = Array.isArray(messages)
          ? messages[0]
          : messages;
      }
    });

    return formattedErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setErrors({});
    setGeneralError("");
    setLoading(true);

    try {
      await forgotPassword({ email });

      setSubmitted(true);

      setTimeout(() => {
        navigate("/reset-password", {
          state: { email },
        });
      }, 1200);
    } catch (err) {
      console.error("Forgot password error:", err.response?.data || err);

      const backendData = err.response?.data;

      if (backendData?.errors) {
        setErrors(formatBackendErrors(backendData.errors));
        return;
      }

      const message =
        backendData?.message ||
        backendData?.title ||
        "Ndodhi një gabim gjatë dërgimit të kodit.";

      setGeneralError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors({});
    setGeneralError("");
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-md border border-gray-200 bg-white p-8">
          <h2 className="text-xl font-normal mb-3 text-blue-600">
            Kontrolloni email-in tuaj
          </h2>
          <p className="text-gray-500 text-sm">
            Nëse email-i ekziston, do të merrni një kod rivendosjeje.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md border-t border-blue-600 bg-white p-8">
        <h2 className="text-xl font-normal mb-2 text-gray-900">
          Forgot Password
        </h2>

        <p className="text-gray-500 text-sm mb-8">
          Shkruani email-in tuaj për të marrë kodin e rivendosjes.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label className="block mb-2 text-sm font-normal text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Shkruani email-in"
              className={`w-full border bg-white px-3 py-2 outline-none transition-colors text-sm ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-600"
              }`}
            />

            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {generalError && (
            <div className="border-l-2 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-600">
              {generalError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-blue-600 bg-blue-600 text-white hover:bg-white hover:text-blue-600 py-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Duke dërguar..." : "Dërgo kodin"}
          </button>
        </form>
      </div>
    </div>
  );
}
