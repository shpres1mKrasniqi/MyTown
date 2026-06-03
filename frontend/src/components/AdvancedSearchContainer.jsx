import useAdvancedSearch from "../hooks/useAdvancedSearch";
import SearchForm from "./SearchForm";
import DataTable from "./DataTable";
import Pagination from "./Pagination";

export default function AdvancedSearchContainer({
  fetchFunction,
  initialFilters,
  fields,
  columns,
  title,
}) {
  const { data, totalCount, filters, setFilters, loading } = useAdvancedSearch(
    fetchFunction,
    initialFilters,
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <SearchForm filters={filters} setFilters={setFilters} fields={fields} />

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          <DataTable columns={columns} data={data} />

          <Pagination
            filters={filters}
            setFilters={setFilters}
            totalCount={totalCount}
          />
        </>
      )}
    </div>
  );
}
