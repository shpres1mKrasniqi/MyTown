export default function MeetingRequestsList() {
  const user = useCurrentUser();
  const { requests, error, fetchRequests, handleDelete, handleStatusChange } =
    useMeetingRequests();

  const isCitizen = user?.roles?.includes("Citizen");
  const isStaff = user?.roles?.includes("Staff");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <MeetingHeader fetchRequests={fetchRequests} />
      <ErrorBanner error={error} />
      <MeetingTable
        requests={requests}
        isCitizen={isCitizen}
        isStaff={isStaff}
        handleDelete={handleDelete}
        handleStatusChange={handleStatusChange}
      />
    </div>
  );
}
