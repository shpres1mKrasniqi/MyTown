import { useEffect, useState } from "react";
import { meetingService } from "../services/meetingService";
import { toast } from "react-toastify";

export default function useMeetingRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await meetingService.getAll();
      setRequests(res.data);
    } catch (err) {
      setError("Gabim gjatë marrjes së të dhënave");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni i sigurt që dëshironi të fshini këtë kërkesë?"))
      return;
    try {
      await meetingService.deleteSoft(id);
      toast.success("Kërkesa u fshi me sukses.");
      fetchRequests();
    } catch {
      toast.error("Fshirja dështoi!");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await meetingService.updateStatus(id, { status: Number(newStatus) });
      toast.success("Statusi u përditësua me sukses!");
      fetchRequests();
    } catch {
      toast.error("Gabim gjatë përditësimit të statusit");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    setRequests,
    error,
    fetchRequests,
    handleDelete,
    handleStatusChange,
  };
}
