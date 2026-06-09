import AdvancedSearchContainer from "../components/AdvancedSearchContainer";
import { advancedSearchService } from "../services/advancedSearchService";

export default function IssueAdvancedSearch() {
  return (
    <AdvancedSearchContainer
      title="Ankesat"
      fetchFunction={advancedSearchService.searchIssues}
      initialFilters={{
        pageNumber: 1,
        pageSize: 10,
        title: "",
        komunaName: "",
      }}
      fields={[
        {
          name: "title",
          placeholder: "Titulli i ankesës...",
        },
        {
          name: "komunaName",
          placeholder: "Komuna...",
        },
      ]}
      columns={[
        { key: "title", label: "Titulli" },
        { key: "komunaName", label: "Komuna" },
        { key: "categoryName", label: "Kategoria" },
        { key: "status", label: "Statusi" },
      ]}
    />
  );
}