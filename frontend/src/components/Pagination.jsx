export default function Pagination({ filters, setFilters, totalCount }) {
  const totalPages = Math.ceil(totalCount / filters.pageSize);

  const goPrev = () => {
    if (filters.pageNumber > 1) {
      setFilters({ ...filters, pageNumber: filters.pageNumber - 1 });
    }
  };

  const goNext = () => {
    if (filters.pageNumber < totalPages) {
      setFilters({ ...filters, pageNumber: filters.pageNumber + 1 });
    }
  };

  return (
    <div className="flex gap-2 mt-4 items-center">
      <button disabled={filters.pageNumber === 1} onClick={goPrev}>
        Prev
      </button>

      <span>
        {filters.pageNumber} / {totalPages || 1}
      </span>

      <button disabled={filters.pageNumber === totalPages} onClick={goNext}>
        Next
      </button>
    </div>
  );
}
