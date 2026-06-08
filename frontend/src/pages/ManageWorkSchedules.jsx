import { useEffect, useState } from "react";
import { workScheduleService } from "../services/workSchedule";
import WorkScheduleForm from "../components/workschedule/WorkScheduleForm";

export default function ManageWorkSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    const res = await workScheduleService.getAll();
    setSchedules(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni i sigurt?")) return;
    await workScheduleService.delete(id);
    fetchData();
  };

  const handleEdit = (item) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Menaxho Orarin</h1>
        <button
          onClick={handleAdd}
          className="bg-[#010694] text-white px-4 py-2 rounded-lg"
        >
          + Shto Orar
        </button>
      </div>

      {showForm && (
        <WorkScheduleForm
          editing={editing}
          onClose={() => setShowForm(false)}
          onSuccess={fetchData}
        />
      )}

      <div className="bg-white rounded-xl shadow p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>Staff</th>
              <th>Data</th>
              <th>Orari</th>
              <th>Lokacioni</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {schedules.map((s, i) => (
              <tr key={i} className="border-b">
                <td>{s.staffName}</td>
                <td>{new Date(s.date).toLocaleDateString()}</td>
                <td>
                  {s.shiftStart} - {s.shiftEnd}
                </td>
                <td>{s.location}</td>

                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
