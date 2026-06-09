import { useEffect, useState } from "react";
import AdvancedSearchContainer from "../components/AdvancedSearchContainer";
import { advancedSearchService } from "../services/advancedSearchService";
import { komunaService } from "../services/komunaService";
import { departmentService } from "../services/departmentService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function DepartmentAdvancedSearch() {
  const [municipalities, setMunicipalities] = useState([]);
  const navigate = useNavigate();

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

  const handleDelete = async (row) => {
    if (!window.confirm("A jeni i sigurt?")) return;

    try {
      await departmentService.delete(row.id);
      toast.success("Departamenti u fshi");
    } catch {
      toast.error("Gabim gjatë fshirjes");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-2 space-y-6">

      {/* HEADER */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-bold">Kërkimi i Departamenteve</h1>
        <p className="text-sm text-gray-500">
          Filtrim sipas emrit dhe komunës
        </p>
      </div>

      {/* SEARCH COMPONENT */}
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
            placeholder: "Kërko departament...",
          },
          {
            name: "municipalityId",
            type: "select",
            placeholder: "Të gjitha komunat",
            options: municipalities.map((m) => ({
              value: m.id,
              label: m.name,
            })),
          },
        ]}
        columns={[
          { key: "name", label: "Emri" },
          { key: "description", label: "Përshkrimi" },
          { key: "komunaName", label: "Komuna" },
        ]}
        onEdit={(row) => navigate(`/edit-department/${row.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}