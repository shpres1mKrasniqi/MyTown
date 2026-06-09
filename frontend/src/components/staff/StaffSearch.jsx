/*import { useEffect, useState } from "react";
import AdvancedSearchContainer from "../AdvancedSearchContainer";
import { advancedSearchService } from "../../services/advancedSearchService";
import { departmentService } from "../../services/departmentService";

export default function StaffSearch() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await departmentService.getAll();
        setDepartments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadDepartments();
  }, []);

  return (
    <AdvancedSearchContainer
      title="Kërkimi i Avancuar i Stafit"
      fetchFunction={advancedSearchService.searchStaff}
      initialFilters={{
        pageNumber: 1,
        pageSize: 5,
        firstName: "",
        lastName: "",
        email: "",
        position: "",
        departmentId: "",
      }}
      fields={[
        {
          name: "firstName",
          placeholder: "Kërko sipas emrit...",
        },
        {
          name: "lastName",
          placeholder: "Kërko sipas mbiemrit...",
        },
        {
          name: "email",
          placeholder: "Kërko sipas email-it...",
        },
        {
          name: "position",
          placeholder: "Kërko sipas pozitës...",
        },
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
        {
          key: "firstName",
          label: "Emri",
        },
        {
          key: "lastName",
          label: "Mbiemri",
        },
        {
          key: "email",
          label: "Email",
        },
        {
          key: "position",
          label: "Pozita",
        },
        {
          key: "departmentName",
          label: "Departamenti",
        },
      ]}
    />
  );
} */