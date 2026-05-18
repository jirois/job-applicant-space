import { useState, useEffect, useCallback } from "react";
import apiClient from "../api/client";

export function useJobs(filters = {}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get("/jobs", { params: filters });
      setJobs(res.data);
    } catch {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    let isActive = true;

    const loadJobs = async () => {
      await Promise.resolve();
      if (!isActive) return;
      await fetchJobs();
    };

    loadJobs();

    return () => {
      isActive = false;
    };
  }, [fetchJobs]);

  const deleteJob = async (id) => {
    await apiClient.delete(`/jobs/${id}`);
    // Optimistically remove from UI without refetching
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return { jobs, loading, error, refetch: fetchJobs, deleteJob };
}
