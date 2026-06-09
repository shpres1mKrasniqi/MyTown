import AdminStats from "../components/admin/AdminStats";
import ProposalsChart from "../components/admin/ProposalChart";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Overview</h1>
        <p className="text-sm text-slate-500">
          Mirë se vini, ja çfarë po ndodh sot.
        </p>
      </div>

      <AdminStats />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ProposalsChart />
        </div>

        <div className="space-y-6">
         <div className="space-y-4">
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
    <h3 className="text-sm font-semibold text-slate-800 mb-3">
      Aktivitete të shpejta
    </h3>

    <div className="space-y-3">

      {/* ALERT */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-50 border border-yellow-100">
        <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500" />
        <div>
          <p className="text-sm font-medium text-slate-800">
            Propozime të reja në pritje
          </p>
          <p className="text-xs text-slate-500">
            Ka kërkesa që kërkojnë shqyrtim urgjent.
          </p>
        </div>
      </div>

      {/* INFO */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
        <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
        <div>
          <p className="text-sm font-medium text-slate-800">
            Votimet janë duke u përditësuar
          </p>
          <p className="text-xs text-slate-500">
            Grafiku rifreskohet në kohë reale me SignalR.
          </p>
        </div>
      </div>

      {/* SUCCESS */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
        <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
        <div>
          <p className="text-sm font-medium text-slate-800">
            Sistemi është aktiv
          </p>
          <p className="text-xs text-slate-500">
            Të gjitha shërbimet po funksionojnë normalisht.
          </p>
        </div>
      </div>

    </div>
  </div>

  {/* QUICK ACTION BUTTONS */}
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
    <h3 className="text-sm font-semibold text-slate-800 mb-3">
      Veprime të shpejta
    </h3>

    <div className="grid grid-cols-2 gap-3">

      <button className="p-3 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100">
        Shiko Propozimet
      </button>

      <button className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100">
        Menaxho Stafin
      </button>

      <button className="p-3 rounded-xl bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100">
        Shiko Votimet
      </button>

      <button className="p-3 rounded-xl bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100">
        Raporte & Issues
      </button>

    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
}
