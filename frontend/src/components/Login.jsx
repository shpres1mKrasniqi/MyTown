import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form);

      const role = res.roles[0];

      if (role === "Admin") {
        navigate("/admin-dashboard");
      } else if (role === "Staff") {
        navigate("/staff-dashboard");
      } else if (role === "Citizen") {
        navigate("/citizen-dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Login deshtoi");
    }
  };

  return (
    <main className="flex items-center justify-center w-full min-h-screen px-4">
      <form onSubmit={handleSubmit} className="flex w-full flex-col max-w-96">
        <h2 className="text-4xl font-medium text-gray-900">Mire se vini</h2>

        <p className="mt-4 text-base text-gray-500/90">
          Vendosni te dhenat tuaja per te vazhduar...
        </p>

        <div className="mt-10">
          <label className="font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="Vendosni Email-in tuaj"
            className="mt-2 rounded-md ring ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-3 w-full"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="mt-6">
          <label className="font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            placeholder="Vendosni Fjalekalimin tuaj"
            className="mt-2 rounded-md ring ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-3 w-full"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="mt-8 py-3 w-full cursor-pointer rounded-md bg-indigo-600 text-white transition hover:bg-indigo-700"
        >
          Login
        </button>

        <p className="text-center py-8">
          Nuk keni llogari?{" "}
          <a href="/create-citizen" className="text-[#0067b8] hover:underline">
            Regjistrohu
          </a>
        </p>

        <Link
          to="/forgot-password"
          className="text-sm text-blue-600 hover:underline"
        >
          Keni harruar fjalëkalimin?
        </Link>
      </form>
    </main>
  );
}
