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
      <div className="hidden lg:flex w-1/2  bg-gradient-to-r from-blue-800 to-blue-200 justify-around items-center relative isolation-auto">
        <div className="relative z-10 px-12">
          <h1 className="text-white font-bold text-4xl">MyTown</h1>
          <p className="text-white mt-2 max-w-sm">
            Mirë se vini në platformën e menaxhimit të qytetit tuaj. Raportoni
            problemet dhe kontribuoni në komunitet.
          </p>
          <button
            onClick={() => setShowMore(!showMore)}
            className="block w-32 bg-white text-indigo-800 mt-6 py-2 rounded-2xl font-bold hover:bg-gray-100 transition-all"
          >
            {showMore ? "Fsheh tekstin" : "Shiko më shumë"}
          </button>

          {showMore && (
            <p className="text-white mt-4 max-w-md transition-all duration-300">
              MyTown është një platformë digjitale që synon të lidhë qytetarët
              me komunën e tyre, duke mundësuar raportimin e problemeve, ndarjen
              e shqetësimeve dhe pjesëmarrjen aktive në vendimmarrje. Platforma
              promovon transparencën, komunikimin dhe përfshirjen qytetare për
              një komunitet më të mirë.
            </p>
          )}
        </div>
      </div>

      {/* Pjesa e formes */}
      <div className="flex w-full lg:w-1/2 justify-center items-center lg:bg-gradient-to-r from-blue-200  to-white sm:bg-white relative z-10">
        <form
          onSubmit={handleSubmit}
          className="bg-whitesmoke p-6 w-full max-w-md"
        >
          <h1 className="text-gray-800 font-bold text-2xl mb-1">
            Mirë se vini!
          </h1>
          <p className="text-sm text-gray-600 mb-6">Kyquni për të vazhduar</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center border-1 py-3 px-3  mb-4">
            <input
              type="email"
              required
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-transparent pl-2 outline-none border-none w-full"
            />
          </div>

          <div className="flex items-center border-1 py-3 px-3  mb-4">
            <input
              type="password"
              required
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="pl-2 outline-none border-none w-full"
            />
          </div>

          <button
            type="submit"
            className="block w-full bg-indigo-600 mt-4 py-3 text-white font-semibold hover:bg-indigo-700 transition-all hover:cursor-pointer"
          >
            Login
          </button>

          <div className="flex justify-between mt-4 text-sm">
            <Link
              to="/forgot-password"
              className="text-gray-500 hover:text-blue-500 font-semibold"
            >
              Keni harruar fjalëkalimin?
            </Link>
            <Link
              to="/create-citizen"
              className="text-blue-500 hover:underline font-semibold"
            >
              Regjistrohu
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
