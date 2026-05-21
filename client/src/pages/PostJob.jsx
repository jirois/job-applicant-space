import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

const JOB_TYPES = ["Full-Time", "Part-Time", "Contract", "Remote"];

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-Time",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiClient.post("/jobs", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  return (
    <div style={{ maxWidth: "560px", margin: "3rem auto", padding: "2rem" }}>
      <h2>Post a Job</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <input
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <input
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <input
          name="location"
          placeholder="Location (optional)"
          value={form.location}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Job description..."
          value={form.description}
          onChange={handleChange}
          rows={5}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            resize: "vertical",
            fontSize: "14px",
          }}
        />
        {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
        <div>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px",
              background: "#4A90E2",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              padding: "10px 18px",
              background: "none",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
