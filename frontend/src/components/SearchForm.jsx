export default function SearchForm({ filters, setFilters, fields }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters({
      ...filters,
      [name]: value,
      pageNumber: 1,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {fields.map((field) => (
        <input
          key={field.name}
          name={field.name}
          placeholder={field.placeholder}
          value={filters[field.name] || ""}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      ))}
    </div>
  );
}
