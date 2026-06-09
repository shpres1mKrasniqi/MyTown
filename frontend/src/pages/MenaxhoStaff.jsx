import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { staffService } from "../services/staffService";
import { toast } from "react-toastify";
import { RefreshCw, Plus } from "lucide-react";

import AdvancedSearchContainer from "../components/AdvancedSearchContainer";
import { advancedSearchService } from "../services/advancedSearchService";
import { departmentService } from "../services/departmentService";

export default function MenaxhoStaff() {
  const [departments, setDepartments] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const navigate = useNavigate();

  // departments
  useEffect(() => {
    const load = async () => {
      try {
        const res = await departmentService.getAll();
        setDepartments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`A jeni i sigurt që dëshironi të fshini staf "${name}"?`))
      return;

    try {
      await staffService.delete(id);
      toast.success("Stafi u fshi me sukses.");

      // refresh search
      setRefreshKey((prev) => prev + 1);
    } catch {
      toast.error("Fshirja dështoi!");
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Stafi</h1>
          <p className="text-sm text-slate-500">
            Menaxho dhe monitoro të gjithë stafin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRefreshKey((p) => p + 1)}
            className="p-2.5 text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
          >
            <RefreshCw size={20} />
          </button>

          <Link
            to="/add-staff"
            className="flex items-center gap-2 bg-[#010694] hover:bg-[#1a1e8a] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            <Plus size={18} />
            Shto Staf
          </Link>
        </div>
      </div>

      {/* ADVANCED SEARCH */}
      <AdvancedSearchContainer
        key={refreshKey}
        fetchFunction={advancedSearchService.searchStaff}
        initialFilters={{
          pageNumber: 1,
          pageSize: 10,
          firstName: "",
          lastName: "",
          email: "",
          position: "",
          departmentId: "",
        }}
        fields={[
          { name: "firstName", placeholder: "Emri" },
          { name: "lastName", placeholder: "Mbiemri" },
          
          {
            name: "departmentId",
            type: "select",
            placeholder: "Të gjitha departamentet",
            options: departments.map((d) => ({
              value: d.id,
              label: d.name,
            })),
          },
        ]}
        columns={[
          { key: "firstName", label: "Emri" },
          { key: "lastName", label: "Mbiemri" },
          { key: "email", label: "Email" },
          { key: "position", label: "Pozita" },
          { key: "departmentName", label: "Departamenti" },
        ]}
        onRowDelete={handleDelete}
        onRowEdit={(row) => navigate(`/edit-staff/${row.id}`)}
      />
    </div>
  );
}