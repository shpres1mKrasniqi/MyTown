import AdvancedSearchContainer from "../components/AdvancedSearchContainer";
import { advancedSearchService } from "../services/advancedSearchService";

export default function MeetingRequestsSearch() {
  return (
    <AdvancedSearchContainer
      title="Meeting Requests"
      fetchFunction={advancedSearchService.searchMeetingRequests}
      initialFilters={{
        pageNumber: 1,
        pageSize: 5,
        title: "",
        reason: "",
      }}
      fields={[
        { name: "title", placeholder: "Title" },
        { name: "reason", placeholder: "Reason" },
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "reason", label: "Reason" },
        { key: "status", label: "Status" },
        { key: "dateOfMeeting", label: "Date" },
      ]}
    />
  );
}
