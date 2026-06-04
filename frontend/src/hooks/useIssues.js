import { useState, useEffect } from "react";
import { useIssuesStore } from "../stores/useIssuesStore";

export default function useIssues() {
  const { issues, fetchIssues, deleteIssue } = useIssuesStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchIssues();
      setLoading(false);
    };

    load();
  }, [fetchIssues]);

  return {
    issues,
    loading,
    fetchIssues,
    deleteIssue,
  };
}
