import { createContext, useContext, useState } from "react";
import apiClient from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize from localStorage so user stays logged in on refresh
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const register = async (username, email, password) => {
    const res = await apiClient.post("/auth/register", {
      username,
      email,
      password,
    });
    const { user, token } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const login = async (email, password) => {
    const res = await apiClient.post("/auth/login", { email, password });
    const { user, token } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
