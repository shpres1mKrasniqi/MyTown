import { useState } from "react";
import { workScheduleService } from "../../services/workSchedule";
import { staffService } from "../../services/staffService";
import { useEffect } from "react";

export default function WorkScheduleForm({ editing, onClose, onSuccess }) {
  const [form, setForm] = useState({
    staffId: editing?.staffId || "",
    date: editing?.date?.slice(0, 10) || "",
    dayOfWeek: editing?.dayOfWeek ?? "",
    shiftStart: editing?.shiftStart || "08:00",
    shiftEnd: editing?.shiftEnd || "16:00",
    shiftType: editing?.shiftType || 0,
    location: editing?.location || "",
    notes: editing?.notes || "",
  });
  const [staffList, setStaffList] = useState([]);
  const formatTime = (t) => (t.length === 5 ? t + ":00" : t);

  useEffect(() => {
    if (form.date) {
      const date = new Date(form.date);
      const day = date.getDay();

      setForm((prev) => ({
        ...prev,
        dayOfWeek: day,
      }));
    }
  }, [form.date]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await staffService.getAll();
        setStaffList(res.data);
      } catch (err) {
        console.error("Gabim gjatë marrjes së stafit", err);
      }
    };

    fetchStaff();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "staffId" ? Number(value) : value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.staffId) {
      alert("Zgjedh stafin!");
      return;
    }

    if (!form.location) {
      alert("Ju lutem zgjedhni lokacionin!");
      return;
    }

    const payload = {
      ...form,
      shiftStart: formatTime(form.shiftStart),
      shiftEnd: formatTime(form.shiftEnd),
    };

    try {
      if (editing) {
        await workScheduleService.update(editing.id, payload);
      } else {
        await workScheduleService.create(payload);
      }

      onSuccess();
      onClose();

      setForm({
        staffId: "",
        date: "",
        dayOfWeek: "",
        shiftStart: "08:00",
        shiftEnd: "16:00",
        shiftType: 0,
        location: "",
        notes: "",
      });
    } catch (err) {
      console.log("BACKEND ERROR:", err.response?.data);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        {editing ? "Edito Orarin" : "Shto Orar"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <select
          name="staffId"
          value={form.staffId}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Zgjedh Stafin</option>

          {staffList.map((staff) => (
            <option key={staff.id} value={staff.id}>
              {staff.firstName} {staff.lastName}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="time"
          name="shiftStart"
          value={form.shiftStart}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="time"
          name="shiftEnd"
          value={form.shiftEnd}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="location"
          placeholder="Lokacioni"
          value={form.location}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        />

        <textarea
          name="notes"
          placeholder="Shënime"
          value={form.notes}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        />

        <button className="col-span-2 bg-[#010694] text-white py-2 rounded">
          Ruaj
        </button>
      </form>
    </div>
  );
}
