import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IssueService } from "../services/IssueServices";
import { toast } from "react-toastify";
import { 
  Search, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  AlertTriangle, 
  Plus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import DataExchangeToolbar from "../components/DataExchangeToolbar";
import SearchWithStatusFilter from "../components/meetings/SearchWithStatusFilter";

const PAGE_SIZE = 10;

export default function MenaxhoIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ searchTerm: "", status: null });
  const navigate = useNavigate();

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const fetchIssues = async (searchParams = {}, page = 1) => {
    setLoading(true);
    try {
      const query = {
        pageSize: PAGE_SIZE,
        pageNumber: page,
      };

      if (searchParams.searchTerm) {
        query.searchTerm = searchParams.searchTerm;
      }

      if (searchParams.status !== null && searchParams.status !== undefined) {
        query.status = searchParams.status;
      }

      const res = await IssueService.search(query);
      setIssues(res.data.items || []);
      setTotalCount(res.data.totalCount || 0);
    } catch {
      toast.error("Gabim gjatë marrjes së të dhënave të ankesave");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchIssues(filters, 1);
  }, [filters]);

  const handleSearch = (searchData) => {
    setFilters({
      searchTerm: searchData.searchTerm,
      status: searchData.status,
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchIssues(filters, newPage);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`A jeni i sigurt që dëshironi të fshini "${title}"?`)) return;
    try {
      await IssueService.delete(id);
      toast.success("Ankesa u fshi me sukses.");
      
      const newPage = issues.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      setCurrentPage(newPage);
      fetchIssues(filters, newPage);
    } catch {
      toast.error("Fshirja dështoi!");
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }
    return pages;
  };

  const formatStatus = (status) => {
    if (status === 0) return "Në pritje";
    if (status === 1) return "Pranuar";
    if (status === 2) return "Refuzuar";
    return status || "Aktive";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Ankesat (Issues)</h1>
          <p className="text-sm text-slate-500">
            Menaxho dhe monitoro të gjitha ankesat në formë tabele.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <DataExchangeToolbar entityType="issues" onImportSuccess={() => fetchIssues(filters, 1)} />
          
          <button 
            onClick={() => fetchIssues(filters, currentPage)}
            className="p-2.5 text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
            title="Rifresko"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="w-full">
        <SearchWithStatusFilter
          onSearch={handleSearch}
          placeholder="Kërko sipas titullit ose komunës..."
        />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Titulli</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Komuna / Kategoria</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Statusi</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Veprimet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues.length > 0 ? (
                issues.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-red-50 text-red-600 flex items-center justify-center rounded-lg shadow-sm">
                          <AlertTriangle size={20} />
                        </div>
                        <span className="font-semibold text-slate-900">{i.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-900 font-medium">{i.komunaName}</p>
                      <p className="text-xs text-slate-500">{i.categoryName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {formatStatus(i.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2 opacity-100 sm:opacity-100 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDelete(i.id, i.title)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Fshij"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400 text-sm">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                        <AlertTriangle size={24} />
                      </div>
                      <p>Nuk u gjet asnjë ankesë.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER */}
        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
            Duke shfaqur{" "}
            <span className="font-bold text-slate-700 bg-slate-200/60 px-1.5 py-0.5 rounded">
              {issues.length}
            </span>{" "}
            nga <span className="font-bold text-slate-700">{totalCount}</span>{" "}
            ankesa — Faqja{" "}
            <span className="font-bold text-slate-700">{currentPage}</span> nga{" "}
            <span className="font-bold text-slate-700">{totalPages || 1}</span>
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1 flex-wrap justify-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#010694] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ChevronLeft size={15} />
              </button>

              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span
                    key={`dots-${i}`}
                    className="px-2 py-1 text-xs text-slate-400 select-none"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[32px] h-8 px-2 text-xs font-bold rounded-lg border transition-all duration-150 ${
                      currentPage === page
                        ? "bg-[#010694] text-white border-[#010694] shadow-sm"
                        : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#010694]"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#010694] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
