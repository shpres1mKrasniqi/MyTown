export default function SearchForm({ filters, setFilters, fields }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value, pageNumber: 1 });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field) => {
        const colSpanClass = field.colSpan === 2 ? "md:col-span-2" : "";

        if (field.type === "select") {
          return (
            <select
              key={field.name}
              name={field.name}
              value={filters[field.name] || ""}
              onChange={handleChange}
              className={`border border-slate-300 rounded-xl px-3 py-2 ${colSpanClass}`}
            >
              <option value="">{field.placeholder}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        }

        return (
          <input
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            type={field.type || "text"}
            value={filters[field.name] || ""}
            onChange={handleChange}
            className={`border border-slate-300 rounded-xl px-3 py-2 ${colSpanClass}`}
          />
        );
      })}
    </div>
  );
}