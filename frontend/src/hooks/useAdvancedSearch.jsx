import { useState, useEffect } from "react";

export default function useAdvancedSearch(fetchFunction, initialFilters) {
  const [filters, setFilters] = useState(initialFilters);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetchFunction(filters);

      setData(res.data.items);
      setTotalCount(res.data.totalCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return {
    data,
    totalCount,
    filters,
    setFilters,
    loading,
  };
}
