import { useState } from "react";

const JOB_TYPES = ["", "Full-Time", "Part-Time", "Contract", "Remote"];

export default function SearchBar({ onSearch }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const handleSearch = () => {
    // Pass only non-empty filters to avoid polluting the query string
    const filters = {};
    if (search.trim()) filters.search = search.trim();
    if (type) filters.type = type;
    onSearch(filters);
  };

  const handleClear = () => {
    setSearch("");
    setType("");
    onSearch({});
  };

  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search title or company..."
        style={{
          flex: 1,
          minWidth: "200px",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "14px",
        }}
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "14px",
        }}
      >
        {JOB_TYPES.map((t) => (
          <option key={t} value={t}>
            {t || "All Types"}
          </option>
        ))}
      </select>

      <button
        onClick={handleSearch}
        style={{
          padding: "10px 18px",
          background: "#4A90E2",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Search
      </button>
      <button
        onClick={handleClear}
        style={{
          padding: "10px 18px",
          background: "none",
          border: "1px solid #ccc",
          borderRadius: "pointer",
          cursor: "#666",
        }}
      >
        Clear
      </button>
    </div>
  );
}
