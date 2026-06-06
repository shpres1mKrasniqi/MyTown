import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError(null);
      const res = await login(form);

      const role = res.roles[0];

      if (role === "Admin") navigate("/admin-dashboard");
      else if (role === "Staff") navigate("/staff-dashboard");
      else if (role === "Citizen") navigate("/citizen-dashboard");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login dështoi. Ju lutem provoni përsëri.");
      }
    }
  };

  return (
    <div className="h-screen flex bg-white">
      <div className="hidden lg:flex w-1/2 bg-gray-100 justify-center items-center">
        <img src="/Login2.jpg" alt="visual" className="w-3/4 object-contain" />
      </div>

      <div className="flex w-full lg:w-1/2 justify-center items-center bg-gradient-to-br from-purple-800 from-blue-700 to-blue-500">
        <form onSubmit={handleSubmit} className="w-full max-w-md px-8">
          <h1 className="text-white font-bold text-3xl mb-2 text-center">
            Mirë se vini!
          </h1>
          <p className="text-white/80 text-sm mb-6 text-center">
            Kyquni për të vazhduar
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-200 text-red-800 rounded-full text-sm text-center">
              {error}
            </div>
          )}

          <div className="mb-4">
            <input
              type="email"
              required
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full py-3 px-5 rounded-full bg-white/90 outline-none"
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              required
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full py-3 px-5 rounded-full bg-white/90 outline-none"
            />
          </div>

          <button
            type="submit"
            className="block w-full bg-yellow-400 mt-4 py-3 text-white font-semibold rounded-full hover:bg-yellow-500 transition hover:cursor-pointer"
          >
            Kyçu
          </button>

          <div className="flex justify-between mt-4 text-sm">
            <Link
              to="/forgot-password"
              className="text-white/80 hover:text-white font-semibold"
            >
              Keni harruar fjalëkalimin?
            </Link>
            <Link
              to="/create-citizen"
              className="text-white hover:underline font-semibold"
            >
              Regjistrohu
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
