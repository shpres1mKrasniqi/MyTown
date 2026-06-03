export default function DataTable({ columns, data }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No data found</p>;
  }

  return (
    <table className="w-full border">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="border p-2">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={col.key} className="border p-2">
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
