import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

export default function SearchWithStatusFilter({
  onSearch,
  placeholder = "Kërko...",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const statuses = [
    { id: 0, name: "Në pritje" },
    { id: 1, name: "Pranuar" },
    { id: 2, name: "Refuzuar" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch({ searchTerm, status: selectedStatus });
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm, selectedStatus]);

  return (
    <div className="w-full">
      {/* KRYESORJA: hiqet overflow-hidden, shtohet rounded-2xl vetëm si border */}
      <div className="flex shadow-sm rounded-2xl border border-slate-200 bg-white">
        {/* DROPDOWN */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200/70 border-r border-slate-200 text-sm font-medium text-slate-700 min-w-[140px] text-left flex justify-between items-center transition-colors h-full rounded-l-2xl gap-2"
          >
            <span className="truncate">
              {selectedStatus !== null
                ? statuses.find((s) => s.id === selectedStatus)?.name
                : "Të gjitha"}
            </span>
            <span
              className={`text-xs flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </button>

          {open && (
            <div className="absolute z-50 bg-white border border-slate-200 rounded-xl mt-1.5 w-48 shadow-lg left-0 top-full overflow-hidden">
              <ul className="text-sm py-1 text-slate-700">
                <li
                  onClick={() => {
                    setSelectedStatus(null);
                    setOpen(false);
                  }}
                  className={`px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between ${
                    selectedStatus === null ? "text-[#202d60] font-medium" : ""
                  }`}
                >
                  Të gjitha
                  {selectedStatus === null && (
                    <span className="text-[#202d60] text-xs">✓</span>
                  )}
                </li>
                {statuses.map((s) => (
                  <li
                    key={s.id}
                    onClick={() => {
                      setSelectedStatus(s.id);
                      setOpen(false);
                    }}
                    className={`px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between ${
                      selectedStatus === s.id
                        ? "text-[#202d60] font-medium"
                        : ""
                    }`}
                  >
                    {s.name}
                    {selectedStatus === s.id && (
                      <span className="text-[#202d60] text-xs">✓</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* INPUT */}
        <input
          type="text"
          className="flex-1 px-4 py-3 text-sm focus:outline-none text-slate-700 font-medium placeholder-slate-400 bg-transparent"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* BUTTON */}
        <button
          type="button"
          onClick={() => onSearch({ searchTerm, status: selectedStatus })}
          className="px-5 py-3 bg-[#202d60] hover:bg-[#162045] text-white text-sm font-bold transition-colors flex items-center gap-2 rounded-r-2xl flex-shrink-0"
        >
          <Search size={15} />
          Kërko
        </button>
      </div>
    </div>
  );
}
