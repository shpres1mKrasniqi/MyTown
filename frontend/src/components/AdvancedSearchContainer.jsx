import useAdvancedSearch from "../hooks/useAdvancedSearch";
import SearchForm from "./SearchForm";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import { Loader2 } from "lucide-react";

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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all">
      {/* Header i Panelit Kryesor */}
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <p className="text-xs text-slate-500 mt-0.5">Filtro dhe kërko të dhënat në kohë reale</p>
      </div>

      {/* Forma e kërkimit (Seksioni i inputeve) */}
      <div className="p-6 bg-white border-b border-slate-100">
        <SearchForm filters={filters} setFilters={setFilters} fields={fields} />
      </div>

      {/* Pjesa e Tabelës dhe Faqosjes */}
      {loading ? (
        <div className="px-6 py-16 text-center text-slate-500 font-medium flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm">Duke ngarkuar të dhënat premium...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <DataTable columns={columns} data={data} />
          </div>

          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
            <Pagination
              filters={filters}
              setFilters={setFilters}
              totalCount={totalCount}
            />
          </div>
        </>
      )}
    </div>
  );
}