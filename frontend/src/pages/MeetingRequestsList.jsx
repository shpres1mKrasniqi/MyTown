
import useCurrentUser from "../hooks/useCurrentUser";
import useMeetingActions from "../hooks/useMeetingActions";

import MeetingHeader from "../components/MeetingHeader";
import MeetingTable from "../components/MeetingTable";
import ErrorBanner from "../components/ErrorBanner";

export default function MeetingRequestsList() {
  const { requests, error, fetchRequests } = useMeetingRequests();
  const user = useCurrentUser();

  const { handleDelete, handleStatusChange } = useMeetingActions(fetchRequests);

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
