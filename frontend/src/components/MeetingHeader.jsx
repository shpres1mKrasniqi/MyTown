import DataExchangeToolbar from "../components/DataExchangeToolbar";

export default function MeetingHeader({ fetchRequests }) {
  return (
    <div className="mb-8 flex justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Kërkesat për Takim</h1>
        <p className="text-sm text-gray-500">Menaxhimi i kërkesave</p>
      </div>

      <DataExchangeToolbar
        entityType="meetings"
        onImportSuccess={fetchRequests}
      />
    </div>
  );
}
