import { useJobs } from "../hooks/useJobs";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";
export default function Home() {
  const [filters, setFilters] = useState({});
  const { jobs, deleteJob, loading, error } = useJobs(filters);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ margin: 0 }}>Job Board</h1>
        <div style={{ display: "flex", gap: "8px" }}>
          {user ? (
            <>
              <button
                onClick={() => navigate("/post")}
                style={{
                  padding: "8px 16px",
                  background: "#4A90E2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Post a Job
              </button>
              <button
                onClick={logout}
                style={{
                  padding: "8px 16px",
                  background: "none",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "8px 16px",
                background: "#4A90E2",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
      <SearchBar onSearch={setFilters} />
      {loading && <p style={{ color: "#888" }}>Loading jobs...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && jobs.length === 0 && (
        <p style={{ color: "#aaa", textAlign: "center", marginTop: "3rem" }}>
          No jobs found. Be the first to post one.
        </p>
      )}

      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onDelete={deleteJob} />
      ))}
    </div>
  );
}
