import { useEffect, useState } from "react";
import { meetingService } from "../services/meetingService";
import { toast } from "react-toastify";
import useCurrentUser from "../hooks/useCurrentUser";
import {
  Trash2,
  RefreshCw,
  MessageSquare,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DataExchangeToolbar from "../components/DataExchangeToolbar";
import SearchWithStatusFilter from "../components/meetings/SearchWithStatusFilter";

const PAGE_SIZE = 5;

export default function MenaxhoMeetings({ isReadonly = false }) {
  const user = useCurrentUser();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ title: "", status: null });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const fetchMeetings = async (searchParams = {}, page = 1) => {
    setLoading(true);
    try {
      const query = {
        pageSize: PAGE_SIZE,
        pageNumber: page,
      };

      if (searchParams.title) {
        query.title = searchParams.title;
      }

      if (searchParams.status !== null && searchParams.status !== undefined) {
        query.status = searchParams.status;
      }

      const res = await meetingService.search(query);
      setMeetings(res.data.items || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      console.error("Fetch meetings error:", err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data ||
          "Gabim gjatë marrjes së kërkesave",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchMeetings(filters, 1);
  }, [filters]);

  const handleSearch = (searchData) => {
    setFilters({
      title: searchData.searchTerm,
      status: searchData.status,
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchMeetings(filters, newPage);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await meetingService.updateStatus(id, { status: Number(newStatus) });
      toast.success("Statusi u përditësua me sukses!");
      fetchMeetings(filters, currentPage);
    } catch (err) {
      toast.error("Gabim gjatë përditësimit të statusit");
    }
  };

  const handleDelete = async (id, title) => {
    if (
      !window.confirm(
        `A jeni i sigurt që dëshironi të fshini kërkesën "${title}"?`,
      )
    )
      return;
    try {
      await meetingService.deleteSoft(id);
      toast.success("Kërkesa u fshi me sukses.");

      const newPage =
        meetings.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
      setCurrentPage(newPage);
      fetchMeetings(filters, newPage);
    } catch {
      toast.error("Fshirja dështoi!");
    }
  };

  const getStatusStyles = (status) => {
    switch (Number(status)) {
      case 0:
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70";
      case 1:
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70";
      case 2:
        return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 bg-gradient-to-r from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200 shadow-sm relative z-10">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#202d60] rounded-l-2xl overflow-hidden" />
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Kërkesat për Takim
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Menaxho të gjitha kërkesat e qytetarëve për takime.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 self-stretch sm:self-center bg-white p-1.5 rounded-xl border border-slate-200/60 shadow-inner justify-between sm:justify-start">
          {!isReadonly && (
            <DataExchangeToolbar
              entityType="meetings"
              onImportSuccess={() => fetchMeetings(filters, 1)}
            />
          )}
          <button
            onClick={() => fetchMeetings(filters, currentPage)}
            className="p-2 text-slate-500 hover:text-[#202d60] hover:bg-slate-100 rounded-lg transition-all duration-150 ml-auto sm:ml-0"
            title="Rifresko"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="w-full">
        <SearchWithStatusFilter
          onSearch={handleSearch}
          placeholder="Kërko sipas titullit ose arsyes së takimit..."
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="block md:hidden divide-y divide-slate-100">
          {meetings.length > 0 ? (
            meetings.map((m, index) => (
              <div key={m.id || index} className="p-5 space-y-4 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 bg-blue-50 text-[#202d60] flex items-center justify-center rounded-xl border border-blue-100 shadow-sm flex-shrink-0">
                      <MessageSquare size={16} />
                    </div>
                    <span className="font-bold text-slate-900 block truncate">
                      {m.title}
                    </span>
                  </div>
                  {!isReadonly && !user?.isStaff && (
                    <button
                      onClick={() => handleDelete(m.id, m.title)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors flex-shrink-0"
                      title="Fshij kërkesën"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="text-sm text-slate-600 font-medium line-clamp-3">
                  <span className="text-xs text-slate-400 block font-normal mb-0.5">
                    Arsyeja:
                  </span>
                  {m.reason}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-50">
                  <span className="flex items-center gap-2 text-slate-600 font-semibold text-xs bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60 whitespace-nowrap">
                    <Calendar size={13} className="text-blue-600" />
                    {new Date(m.dateOfMeeting).toLocaleDateString("sq-AL", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  <select
                    value={m.status}
                    onChange={(e) => handleStatusChange(m.id, e.target.value)}
                    className={`text-xs font-bold border rounded-xl px-3 py-1.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer shadow-sm transition-all duration-150 bg-white w-full sm:w-auto ${getStatusStyles(m.status)}`}
                  >
                    <option value={0}>Në pritje</option>
                    <option value={1}>Pranuar</option>
                    <option value={2}>Refuzuar</option>
                  </select>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-16 text-center text-slate-400 bg-white flex flex-col items-center justify-center gap-3">
              <div className="h-12 w-12 bg-blue-50 text-[#202d60] rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                <MessageSquare size={22} />
              </div>
              <p className="font-semibold text-slate-700 text-base">
                Nuk u gjet asnjë kërkesë.
              </p>
              <p className="text-xs text-slate-400 -mt-1">
                Nuk ka të dhëna për t'u shfaqur për këtë kriter.
              </p>
            </div>
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#202d60] text-white text-xs font-bold uppercase tracking-wider border-b border-[#162045]">
                <th className="px-6 py-4.5 font-bold tracking-wide">Titulli</th>
                <th className="px-6 py-4.5 font-bold tracking-wide">Arsyeja</th>
                <th className="px-6 py-4.5 font-bold tracking-wide">
                  Data e Kërkuar
                </th>
                <th className="px-6 py-4.5 font-bold tracking-wide">Statusi</th>
                {!isReadonly && !user?.isStaff && (
                  <th className="px-6 py-4.5 font-bold tracking-wide text-right">
                    Veprimet
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {meetings.length > 0 ? (
                meetings.map((m, index) => (
                  <tr
                    key={m.id || index}
                    className="hover:bg-blue-50/40 even:bg-slate-50/30 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-4.5 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-blue-50 text-[#202d60] flex items-center justify-center rounded-xl border border-blue-100 shadow-sm flex-shrink-0">
                          <MessageSquare size={16} />
                        </div>
                        <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-150 block truncate max-w-[200px]">
                          {m.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-slate-600 font-medium max-w-xs truncate align-middle">
                      {m.reason}
                    </td>
                    <td className="px-6 py-4.5 align-middle">
                      <span className="flex items-center gap-2 text-slate-600 font-semibold text-xs bg-slate-100 px-2.5 py-1 rounded-lg w-fit border border-slate-200/60 whitespace-nowrap">
                        <Calendar size={13} className="text-blue-600" />
                        {new Date(m.dateOfMeeting).toLocaleDateString("sq-AL", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 align-middle">
                      <select
                        value={m.status}
                        onChange={(e) =>
                          handleStatusChange(m.id, e.target.value)
                        }
                        className={`text-xs font-bold border rounded-xl px-3 py-1.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer shadow-sm transition-all duration-150 bg-white ${getStatusStyles(m.status)}`}
                      >
                        <option value={0}>Në pritje</option>
                        <option value={1}>Pranuar</option>
                        <option value={2}>Refuzuar</option>
                      </select>
                    </td>
                    {!isReadonly && !user?.isStaff && (
                      <td className="px-6 py-4.5 text-right align-middle whitespace-nowrap">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => handleDelete(m.id, m.title)}
                            className="p-2 text-slate-400 hover:text-rose-600"
                            title="Fshij kërkesën"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isReadonly ? 4 : 5}
                    className="px-6 py-16 text-center text-slate-400 bg-white"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-12 w-12 bg-blue-50 text-[#202d60] rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                        <MessageSquare size={22} />
                      </div>
                      <p className="font-semibold text-slate-700 text-base">
                        Nuk u gjet asnjë kërkesë.
                      </p>
                      <p className="text-xs text-slate-400 -mt-1">
                        Nuk ka të dhëna për t'u shfaqur për këtë kriter.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
            Duke shfaqur{" "}
            <span className="font-bold text-slate-700 bg-slate-200/60 px-1.5 py-0.5 rounded">
              {meetings.length}
            </span>{" "}
            nga <span className="font-bold text-slate-700">{totalCount}</span>{" "}
            kërkesa — Faqja{" "}
            <span className="font-bold text-slate-700">{currentPage}</span> nga{" "}
            <span className="font-bold text-slate-700">{totalPages || 1}</span>
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1 flex-wrap justify-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#202d60] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
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
                        ? "bg-[#202d60] text-white border-[#202d60] shadow-sm"
                        : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#202d60]"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#202d60] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
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
