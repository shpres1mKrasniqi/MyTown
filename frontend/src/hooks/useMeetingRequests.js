import { useEffect, useState } from "react";
import { meetingService } from "../services/meetingService";

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

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    setRequests,
    error,
    fetchRequests,
  };
}
