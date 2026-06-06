import { useState, useEffect } from "react";
import { komunaService } from "../services/komunaService";
export default function SearchWithFilter({
  onSearch,
  municipalities = [],
  placeholder = "Search...",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch({
        searchTerm,
        municipalityId: selectedMunicipality,
      });
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm, selectedMunicipality]);

  return (
    <div className="max-w-2xl">
      <div className="flex shadow-sm rounded-lg">
        {/* DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="px-4 py-2.5 border bg-gray-100 rounded-l-lg text-sm"
          >
            {selectedMunicipality
              ? municipalities.find((m) => m.id === selectedMunicipality)?.name
              : "Të gjitha komunat"}
          </button>

          {open && (
            <div className="absolute z-10 bg-white border rounded-lg mt-1 w-52 shadow">
              <ul className="text-sm">
                <li
                  onClick={() => {
                    setSelectedMunicipality(null);
                    setOpen(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  Të gjitha
                </li>

                {municipalities.map((m) => (
                  <li
                    key={m.id}
                    onClick={() => {
                      setSelectedMunicipality(m.id);
                      setOpen(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {m.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* INPUT */}
        <input
          type="text"
          className="flex-1 px-3 py-2.5 border-t border-b text-sm"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={() =>
            onSearch({
              searchTerm,
              municipalityId: selectedMunicipality,
            })
          }
          className="px-4 py-2.5 bg-[#010694] text-white rounded-r-lg text-sm"
        >
          Search
        </button>
      </div>
    </div>
  );
}
