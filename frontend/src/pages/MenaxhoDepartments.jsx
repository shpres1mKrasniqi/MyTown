import { useEffect, useState } from "react";
import AdvancedSearchContainer from "../components/AdvancedSearchContainer";
import { advancedSearchService } from "../services/advancedSearchService";
import { departmentService } from "../services/departmentService";
import { komunaService } from "../services/komunaService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function MenaxhoDepartments() {
  const [municipalities, setMunicipalities] = useState([]);
  const navigate = useNavigate();

  // Load municipalities for dropdown
  useEffect(() => {
    const load = async () => {
      try {
        const res = await komunaService.getAll();
        setMunicipalities(res.data);
      } catch {
        toast.error("Gabim gjatë komunave");
      }
    };

    load();
  }, []);

  // Delete department
  const handleDelete = async (row) => {
    if (!window.confirm("A jeni i sigurt që dëshironi të fshini?")) return;

    try {
      await departmentService.delete(row.id);
      toast.success("Departamenti u fshi me sukses");

      // refresh handled automatically nga AdvancedSearchContainer
    } catch {
      toast.error("Fshirja dështoi!");
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Drejtoritë
          </h1>
          <p className="text-sm text-slate-500">
            Menaxho dhe kërko departamentet
          </p>
        </div>
      </div>

      {/* ADVANCED SEARCH */}
      <AdvancedSearchContainer
        title="Departamentet"
        fetchFunction={advancedSearchService.searchDepartments}
        initialFilters={{
          pageNumber: 1,
          pageSize: 10,
          searchTerm: "",
          municipalityId: "",
        }}
        fields={[
          {
            name: "searchTerm",
            placeholder: "Kërko sipas emrit të departamentit...",
          },
          {
            name: "municipalityId",
            type: "select",
            placeholder: "Zgjedh komunën",
            options: municipalities.map((m) => ({
              value: m.id,
              label: m.name,
            })),
          },
        ]}
        columns={[
          { key: "name", label: "Departamenti" },
          { key: "description", label: "Përshkrimi" },
          { key: "komunaName", label: "Komuna" },
        ]}
        onEdit={(row) => navigate(`/edit-department/${row.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}