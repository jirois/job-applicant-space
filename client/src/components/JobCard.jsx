import { useAuth } from "../context/AuthContext";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function JobCard({ job, onDelete }) {
  const { user } = useAuth();

  // Only show delete button to the user who posted the job
  const isOwner = user?.id === job.user_id;

  return (
    <div
      style={{
        padding: "1.5rem",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        marginBottom: "12px",
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: "16px" }}>{job.tile}</h3>
          <p style={{ margin: "0 0 8px", color: "#555", fontSize: "14px" }}>
            {job.company} {job.location}
          </p>
        </div>

        {/* Job type badge */}
        {job.type && (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "999px",
              fontSize: "12px",
              background: "#EEF4FF",
              color: "#4A90E2",
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            {job.type}
          </span>
        )}
      </div>

      <p
        style={{
          margin: "0 0 12px",
          fontSize: "14px",
          color: "#666",
          lineHeight: 1.5,
        }}
      >
        {job.description.length > 150
          ? job.description.slice(0, 150) + "..."
          : job.description}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <small style={{ color: "#aaa" }}>
          Posted by {job.posted_by} . {formatDate(job.created_at)}
        </small>

        {isOwner && (
          <button
            onClick={() => onDelete(job.id)}
            style={{
              background: "none",
              border: "1px solid #ff4d4f",
              color: "#ff4d4f",
              padding: "4px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
