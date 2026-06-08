import { useEffect, useState } from "react";
import { workScheduleService } from "../services/workSchedule";

export default function ViewWorkSchedules() {
  const [schedules, setSchedules] = useState([]);

  const fetchData = async () => {
    try {
      const res = await workScheduleService.getAll();
      setSchedules(res.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së orarit:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Orari i Punës</h1>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
              <tr>
                <th className="py-3 px-4">Staff</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Orari</th>
                <th className="py-3 px-4">Lokacioni</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-700">
              {schedules.length > 0 ? (
                schedules.map((s, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      {s.staffName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {new Date(s.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {s.shiftStart} - {s.shiftEnd}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {s.location || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-400">
                    Nuk ka asnjë orar të regjistruar për momentin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
