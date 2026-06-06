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
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Informacione të shpejta
            </h3>
            <p className="text-sm text-slate-500">
              Këtu mund të shtosh KPI, aktivitetet e fundit ose alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
