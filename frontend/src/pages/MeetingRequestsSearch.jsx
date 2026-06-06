import React, { useEffect, useState } from "react";
import AdvancedSearchContainer from "../components/AdvancedSearchContainer";
import { advancedSearchService } from "../services/advancedSearchService";
import { meetingService } from "../services/meetingService";
import { currentUser } from "../services/authService";
import { toast } from "react-toastify";
import DataExchangeToolbar from "../components/DataExchangeToolbar";
import { Calendar, Layers } from "lucide-react";

export default function MeetingRequestsSearch() {
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await currentUser();
        setUser(data);
      } catch (err) {
        console.error("Gabim gjatë marrjes së përdoruesit", err);
      }
    };
    fetchUser();
  }, []);

  const isStaff = user?.roles?.includes("Staff");

  const handleStatusChange = async (id, newStatus) => {
    try {
      await meetingService.updateStatus(id, {
        status: Number(newStatus),
      });
      toast.success("Statusi u përditësua me sukses!");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      toast.error("Gabim gjatë përditësimit të statusit");
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

  const getStatusText = (status) => {
    switch (Number(status)) {
      case 0: return "Pending";
      case 1: return "Approved";
      case 2: return "Rejected";
      default: return "Unknown";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 bg-gradient-to-r from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#202d60]" />
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-[#202d60] rounded-xl hidden sm:block border border-blue-100">
            <Layers size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Kërkesat për Takim</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Menaxhoni, filtroni dhe ndryshoni statusin e kërkesave përmes motorit të kërkimit të avancuar.
            </p>
          </div>
        </div>
        
        <div className="bg-white p-1.5 rounded-xl border border-slate-200/60 shadow-inner self-start sm:self-center">
          <DataExchangeToolbar entityType="meetings" onImportSuccess={() => setRefreshKey((prev) => prev + 1)} />
        </div>
      </div>

      {/* KONTENIERI I AVANCUAR KËRKIMIT */}
      <div className="shadow-sm rounded-2xl overflow-hidden">
        <AdvancedSearchContainer
          key={refreshKey}
          title="Filtri i Avancuar i Takimeve"
          fetchFunction={advancedSearchService.searchMeetingRequests}
          initialFilters={{
            pageNumber: 1,
            pageSize: 5,
            title: "",
            reason: "",
          }}
          fields={[
            { name: "title", placeholder: "Kërko sipas titullit të takimit..." },
            { name: "reason", placeholder: "Kërko sipas arsyes ose specifikës..." },
          ]}
          onStatusUpdate={handleStatusChange} // Kalon funksionin te DataTable e re premium
          columns={[
            { key: "title", label: "Titulli" },
            { key: "reason", label: "Arsyeja" },
            {
              key: "dateOfMeeting",
              label: "Data e Takimit",
              render: (value) => (
                <span className="flex items-center gap-2 text-slate-700 font-semibold text-xs bg-slate-100 px-2.5 py-1 rounded-lg w-fit border border-slate-200/60 whitespace-nowrap">
                  <Calendar size={13} className="text-blue-600" />
                  {new Date(value).toLocaleString("sq-AL", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              ),
            },
            {
              key: "status",
              label: "Statusi",
              render: (value, row) => {
                return isStaff ? (
                  <select
                    value={value}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    className={`text-xs font-bold border rounded-xl px-3 py-1.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer shadow-sm transition-all duration-150 ${getStatusStyles(value)}`}
                  >
                    <option value={0}>Në pritje</option>
                    <option value={1}>Pranuar</option>
                    <option value={2}>Refuzuar</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${getStatusStyles(value)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${value === 1 ? 'bg-emerald-500' : value === 2 ? 'bg-rose-500' : 'bg-amber-500'}`} />
                    {getStatusText(value)}
                  </span>
                );
              },
            },
          ]}
        />
      </div>
    </div>
  );
}