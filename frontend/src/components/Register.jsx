import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function Register(){
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const res = await register(form);

            navigate("/");
        }catch(err){
            toast.error("Regjistrimi deshtoi");
        }
    };



return (
  <main className="flex items-center justify-center w-full min-h-screen bg-gray-50 px-4">
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <header className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Krijo llogari
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Plotësoni të dhënat për të filluar rrugëtimin me ne.
          </p>
        </header>

        <div className="space-y-5">
          {/* Grouping Name and Last Name in one row for better desktop view */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 ml-1">Emri</label>
              <input
                type="text"
                required
                placeholder="Filan"
                className="mt-1.5 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none text-gray-900"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 ml-1">Mbiemri</label>
              <input
                type="text"
                required
                placeholder="Fisteku"
                className="mt-1.5 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none text-gray-900"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
            <input
              type="email"
              required
              placeholder="emri@shembull.com"
              className="mt-1.5 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none text-gray-900"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 ml-1">Fjalëkalimi</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="mt-1.5 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none text-gray-900"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 py-3 w-full rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all"
        >
          Regjistrohu
        </button>

        <footer className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Ke llogari?{" "}
            <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Identifikohu këtu
            </a>
          </p>
        </footer>
      </form>
    </div>
  </main>
);
};